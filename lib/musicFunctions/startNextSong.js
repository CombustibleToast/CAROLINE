// https://github.com/fent/node-ytdl-core#readme
const ytdl = require('ytdl-core');

//ytdl causes an error with nodejs v16, use this instead
//https://github.com/microlinkhq/youtube-dl-exec
const youtubedl = require('youtube-dl-exec');

const { createAudioResource } = require('@discordjs/voice')

module.exports = {
    name: "startNextSong",

    async execute(loudspeakerClient) {
        //the song at the front of the queue should be removed by the caller.
        //collect song at queue front
        const song = loudspeakerClient.queue[0];
        //download stream
        loudspeakerClient.songStream = ytdl(song.url, { filter: "audioonly" });
        /*
        loudspeakerClient.songStream = youtubedl(song.url, {
            o: '-',
            q: '',
            f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
            r: '100K',
        },
        {
            stdio: ['ignore', 'pipe', 'ignore']
        });
        */

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