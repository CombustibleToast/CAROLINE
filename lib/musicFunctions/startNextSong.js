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

        //install event handlers (DEBUGGING)
        loudspeakerClient.player.on(AudioPlayerStatus.Paused, () => {
            console.log("PAUSED!")
        });
        loudspeakerClient.player.on(AudioPlayerStatus.Playing, () => {
            console.log("PLAYING!")
        });
        loudspeakerClient.player.on(AudioPlayerStatus.Idle, () => {
            console.log("IDLE!")
        });
        loudspeakerClient.player.on(AudioPlayerStatus.Buffering, () => {
            console.log("BUFFERING!")
        });
        loudspeakerClient.player.on(AudioPlayerStatus.AutoPaused, () => {
            console.log("AUTOPAUSED!")
        });
        loudspeakerClient.player.on('error', error => {
            console.error(`Error: ${error.message}`);
        });
    }
}