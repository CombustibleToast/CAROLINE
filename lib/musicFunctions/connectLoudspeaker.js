

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

	//console.log(vacantLoudspeakerClient.connection);

	//init loudspeaker with queue
	loudspeakerClient.queue = [];

	//init player
	loudspeakerClient.player = createAudioPlayer({
		behaviors: {
			//noSubscriber: NoSubscriberBehavior.Play
			debug: true
		}
	});

	//dump data (DEBUGGING)
	function dump(){
		//console.log(`Current connection: ${loudspeakerClient.connection}`);
	}

	//install event handlers (DEBUGGING)
	loudspeakerClient.player.on(AudioPlayerStatus.Paused, () => {
		console.log("PAUSED!");
		dump();
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Playing, () => {
		console.log("PLAYING!");
		dump();
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Idle, () => {
		console.log("IDLE!");
		dump();
	});
	loudspeakerClient.player.on(AudioPlayerStatus.Buffering, () => {
		console.log("BUFFERING!");
		dump();
	});
	loudspeakerClient.player.on(AudioPlayerStatus.AutoPaused, () => {
		console.log("AUTOPAUSED!");
		dump();
	});
	loudspeakerClient.player.on('error', error => {
		console.log(`Error: ${error.message}`);
	});
	loudspeakerClient.player.on('stateChange', (oldState, newState) => {
		console.log(`${oldState.status} -> ${newState.status}`);
		dump();
	});
	loudspeakerClient.connection.on('error', error => {
		console.log(`Connection Error: ${error.message}`);
	})
}