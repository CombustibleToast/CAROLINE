const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
	name: "connectLoudspeaker",

	async execute(interaction) {
		const voiceChannelId = interaction.member.voice.channelId;
		const loudspeakerList = interaction.client.loudspeakers;
		const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(voiceChannelId, loudspeakerList);

		if (loudspeakerAssignmentResult.status == "new assignment") {
			//assign a new loudspeaker and initialize it
			const loudspeakerClient = loudspeakerList.get(loudspeakerAssignmentResult.loudspeakerId);
			const voiceChannel = await loudspeakerClient.channels.fetch(interaction.member.voice.channel.id);
			initLoudspeaker(loudspeakerClient, voiceChannel);
		}

		//If there were no vacant loudspeakers or one has already been assigned, do nothing 
		return loudspeakerAssignmentResult;
	}
}

async function initLoudspeaker(loudspeakerClient, channel) {
	//have the bot join the channel https://discordjs.guide/voice/voice-connections.html#cheat-sheet
	//IMPORTANT! The client that instantiates the Guild object when
	//creating the voice adapter will be the one who joins the channel!
	//Source: https://discord.com/channels/222078108977594368/1090014703209693194/1090123144594980934
	//IMPORTANT! The /voice will attempt to reuse connections from the same group,
	//so use a different group identifier for every bot!
	//Source: https://discord.com/channels/222078108977594368/1114539446629572668/1114558326341120142 
	const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
	loudspeakerClient.connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
		group: loudspeakerClient.id
	});

	//I have no idea what this does other than listen to the connection's state change.
	//This fixes an issue where the playback would consistently stop around 1 minute but the player would not show any errors or state changes.
	//https://github.com/umutxyp/MusicBot/issues/97#issuecomment-1452607414
	//NEVERMIND this was patched; updating djs/voice fixed the issue and this is no longer necessary
	/*
	loudspeakerClient.connection.on('stateChange', (oldState, newState) => {
		const oldNetworking = Reflect.get(oldState, 'networking');
		const newNetworking = Reflect.get(newState, 'networking');
		const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
			const newUdp = Reflect.get(newNetworkState, 'udp');
			clearInterval(newUdp?.keepAliveInterval);
		}
		oldNetworking?.off('stateChange', networkStateChangeHandler);
		newNetworking?.on('stateChange', networkStateChangeHandler);
	});
	*/

	//init loudspeaker with empty queue
	loudspeakerClient.queue = [];

	//init player
	loudspeakerClient.player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play,
			debug: true
		}
	});

	//install event handlers (DEBUGGING)
	loudspeakerClient.player.on(AudioPlayerStatus.Paused, () => {
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Playing, () => {
		//this is set in function music.js where the next song that starts playing may be paused.
		if (loudspeakerClient.player.pauseOnNextPlay) {
			loudspeakerClient.player.pause();
			loudspeakerClient.player.pauseOnNextPlay = undefined;
		}
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Idle, () => {
		if(!loudspeakerClient.player || loudspeakerClient.player.markedForDeletion)
			return;
		
		if(loudspeakerClient.player.songErroredOut){
			//don't remove the current song and just replay it. The function will detect that the song was errored out and will start it at the correct time.
			console.log(`Song errored`)
			loudspeakerClient.parentClient.functions.get("startNextSong").execute(loudspeakerClient);
		}
		else
			autoplayNextSong(loudspeakerClient);
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Buffering, () => {
	});
	loudspeakerClient.player.on(AudioPlayerStatus.AutoPaused, () => {
	});
	loudspeakerClient.player.on('error', error => {
		loudspeakerClient.player.songErroredOut = true;
		console.log(`MUSIC - [WARN] ${loudspeakerClient.user.username} encountered an error:\n${error.stack}`);
	});
	loudspeakerClient.player.on('stateChange', (oldState, newState) => {
		console.log(`MUSIC - [INFO] ${loudspeakerClient.user.username}: ${oldState.status} -> ${newState.status}`);
	});
	loudspeakerClient.connection.on('error', error => {
		console.log(`MUSIC - [WARN] ${loudspeakerClient.user.username} connection error:\n${error.message}`);
	});
}

function autoplayNextSong(loudspeakerClient) {
	//if the player is about to be or is already destroyed, don't try to play the next song.
	if (!loudspeakerClient.player || loudspeakerClient.player.markedForDeletion)
		return;

	console.log(`MUSIC - [INFO] ${loudspeakerClient.user.username} autoplaying next song in queue.`);
	//remove the song that just finished
	let removedItem = loudspeakerClient.queue.length != 0 ? loudspeakerClient.queue.shift() : undefined;

	//if the first song should be looping (ifelse makes loopOne take precedence over just loop)
	if (loudspeakerClient.player.loopOne) {
		//in some cases (skip when there's only 1 song), loop should not readd the song
		if (loudspeakerClient.player.loopNoReadd)
			loudspeakerClient.player.loopNoReadd = undefined;
		else
			loudspeakerClient.queue.unshift(removedItem)
	}
	//if the queue should be looping, readd the item to the back of the list
	else if (loudspeakerClient.player.loop) {
		//in some cases (skip when there's only 1 song), loop should not readd the song
		if (loudspeakerClient.player.loopNoReadd)
			loudspeakerClient.player.loopNoReadd = undefined;
		else
			loudspeakerClient.queue.push(removedItem);
	}

	//start the next song
	if (loudspeakerClient.queue.length != 0)
		loudspeakerClient.parentClient.functions.get("startNextSong").execute(loudspeakerClient); //using interaction here might lead to some problems
}