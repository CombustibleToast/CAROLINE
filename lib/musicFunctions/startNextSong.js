// https://github.com/fent/node-ytdl-core#readme
const ytdl = require('ytdl-core');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')

module.exports = {
    name: "startNextSong",

    async execute(loudspeakerClient) {
        //the song at the front of the queue should be removed by the caller.
        //collect song at queue front
        const song = loudspeakerClient.queue[0];
        //download stream
        loudspeakerClient.songStream = ytdl(song.url, { filter: "audioonly" });

        //https://discordjs.guide/voice/audio-player.html#playing-audio
        //play audio 
        //create audio resource
        const resource = createAudioResource(loudspeakerClient.songStream);
        //play source
        loudspeakerClient.player.play(resource);
        //subscribe to player
        loudspeakerClient.connection.subscribe(loudspeakerClient.player);
    }
}