const { } = require('discord-player');

module.exports = {
    name: "play",
    /**
     * This function should:
     * Assign a new vacant loudspeaker to the user's channel if there isn't one already already assigned and have it join the channel.
     * If there is no queue, create a new one.
     * Parse whether the query is a video link, playlist link, or search term and enqueue the found video(s).
     * If there is no query, unpause the playback (call resume.js).
     */
    async execute(interaction) {
        //get loudspeaker assignment
        const voiceChannelId = interaction.member.voice.channelId;
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(voiceChannelId, interaction.client.loudspeakers);

        //If there are no vacant loudspeakers
        if (loudspeakerAssignmentResult.status == "no vacancies") {
            await interaction.reply({ content: "There are no vacant loudspeakers at the moment.", ephemeral: true });
            return;
        }

        //collect the channel's loudspeaker
        const loudspeakerClient = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId);

        //if there is a new assignment
        if (loudspeakerAssignmentResult.status == "new assignment") {
            await interaction.reply({ content: "Assigning a new loudspeaker to your voice channel.", ephemeral: true });
            initLoudspeaker(loudspeakerClient, await loudspeakerClient.channels.fetch(interaction.member.voice.channel.id));
        }

        //collect query
        
        //If there is a query, search for it and enqueue it

        //if there is not a query, resume playback
        
    }
}

async function initLoudspeaker(loudspeakerClient, channel) {
    //have the bot join the channel https://discordjs.guide/voice/voice-connections.html#cheat-sheet
    //IMPORTANT! The client that instantiates the Guild object when
    //creating the voice adapter will be the one who joins the channel!
    //Source: https://discord.com/channels/222078108977594368/1090014703209693194/1090123144594980934
    const { joinVoiceChannel } = require('@discordjs/voice');
    loudspeakerClient.connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });

    //console.log(vacantLoudspeakerClient.connection);

    //TODO: init loudspeaker with queue
    //TODO: init music playing state
    //TODO: subscribe to the audio source? https://discordjs.guide/voice/voice-connections.html#playing-audio

}


/**
VoiceConnection {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  rejoinAttempts: 0,
  _state: {
    status: 'signalling',
    adapter: {
      sendPayload: [Function: sendPayload],
      destroy: [Function: destroy]
    }
  },
  joinConfig: {
    selfDeaf: true,
    selfMute: false,
    group: 'default',
    channelId: '602596056227643402',
    guildId: '602596055711875081',
    adapterCreator: [Function (anonymous)]
  },
  packets: { server: undefined, state: undefined },
  receiver: VoiceReceiver {
    voiceConnection: [Circular *1],
    ssrcMap: SSRCMap {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      map: Map(0) {},
      [Symbol(kCapture)]: false
    },
    subscriptions: Map(0) {},
    connectionData: {},
    speaking: SpeakingMap {
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      users: Map(0) {},
      speakingTimeouts: Map(0) {},
      [Symbol(kCapture)]: false
    },
    onWsPacket: [Function: bound onWsPacket],
    onUdpMessage: [Function: bound onUdpMessage]
  },
  debug: null,
  onNetworkingClose: [Function: bound onNetworkingClose],
  onNetworkingStateChange: [Function: bound onNetworkingStateChange],
  onNetworkingError: [Function: bound onNetworkingError],
  onNetworkingDebug: [Function: bound onNetworkingDebug],
  [Symbol(kCapture)]: false
}
 */