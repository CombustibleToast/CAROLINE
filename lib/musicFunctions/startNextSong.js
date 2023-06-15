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
        //let options = { filter: "audioonly" };
        let options = {  };
        //If the song had errored out (see connectLoudSpeaker.js), set the begin time to account for what part of the song was skipped.
        if (loudspeakerClient.player.songErroredOut) {
            loudspeakerClient.player.songErroredOut = undefined;
            const startDate = new Date(Date.now() - loudspeakerClient.player.songStartedAt);
            options.begin = `${startDate.getUTCMilliseconds()}ms, ${startDate.getUTCSeconds()}s, ${startDate.getUTCMinutes()}m, ${startDate.getUTCHours()}h`;
            //console.log(`Song errored out, downloading song from ${debugDate.getMinutes()}:${debugDate.getSeconds()} (${options.begin})`);
            console.log(`Song errored out, downloading song from ${options.begin} (${startDate.getMilliseconds()})`);
        }
        else {
            //save the timestamp in case an error occurs
            //Don't save the time stamp if continuing from an errored state
            console.log(`Song started normally; collected timestamp ${Date.now()}`);
            loudspeakerClient.player.songStartedAt = Date.now();
        }
        //download stream
        loudspeakerClient.songStream = ytdl(song.url, options);
        console.log(`Options:`);
        console.log(options);
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