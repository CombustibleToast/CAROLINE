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
			const voiceChannel = await loudspeakerClient.channels.fetch(interaction.member.voice.channel.id)
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
	const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
	loudspeakerClient.connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator
	});

	//I have no idea what this does other than listen to the connection's state change.
	//This fixes an issue where the playback would consistently stop around 1 minute but the player would not show any errors or state changes.
	//https://github.com/umutxyp/MusicBot/issues/97#issuecomment-1452607414
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

	//init loudspeaker with queue
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
		if(loudspeakerClient.player.pauseOnNextPlay){
			loudspeakerClient.player.pause();
			loudspeakerClient.player.pauseOnNextPlay = undefined;
		}
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Idle, () => {
		autoplayNextSong(loudspeakerClient);
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Buffering, () => {
	});
	loudspeakerClient.player.on(AudioPlayerStatus.AutoPaused, () => {
	});
	loudspeakerClient.player.on('error', error => {
		console.log(`Error: ${error.message}`);
	});
	loudspeakerClient.player.on('stateChange', (oldState, newState) => {
		console.log(`${oldState.status} -> ${newState.status}`);
	});
	loudspeakerClient.connection.on('error', error => {
		console.log(`Connection Error: ${error.message}`);
	});
}

function autoplayNextSong(loudspeakerClient) {
	console.log("Autoplaying next song in queue");
	if (loudspeakerClient.queue.length != 0)
		loudspeakerClient.queue.shift();
	if (loudspeakerClient.queue.length != 0)
		loudspeakerClient.parentClient.functions.get("startNextSong").execute(loudspeakerClient); //using interaction here might lead to some problems
}