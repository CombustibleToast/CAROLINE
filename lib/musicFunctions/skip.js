const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "skip",

    /**
     * Skips the current playing song by calling player.stop(). The autoplayer will immediately play the next song in the queue if there is one.
     * If the playback is paused, it shoud also immediately pause the playback of the new song.
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //start a response to the user
        let response = "";

        //do nothing if the queue is empty
        if(loudspeakerClient.queue.length == 0){
            response = "The queue is empty; there is nothing to skip."
            await interaction.followUp(response);
            return response;
        }

        response = "Current song skipped.";
        if(loudspeakerClient.queue.length > 1)
            response += `\nNow playing [${loudspeakerClient.queue[1].title}](<${loudspeakerClient.queue[1].url}>).`;

        //start playing the song really quick so that stop() sets the player to the idle state, triggering autoplay
        loudspeakerClient.player.unpause();
        //if the user wants the next song to be paused, set that now
        //if there's no other song in the list, don't bother doing this
        //ternary for compatibiltiy with music button controls
        const pauseChoice = interaction.options ? interaction.options.getBoolean('pause') : undefined;
        if(pauseChoice && loudspeakerClient.queue.length > 1){
            loudspeakerClient.player.pauseOnNextPlay = true;
            response += "\nThe next song will be paused.";
        }
        //edge case: if loop is on, queue has exactly 1 song, and skip is used, the song should not be readded to the queue
        if(loudspeakerClient.queue.length == 1 && loudspeakerClient.player.loop)
            loudspeakerClient.player.loopNoReadd = true;
        
        //stop the player which will load the next song
        await loudspeakerClient.player.stop();

        await interaction.followUp(response);
        return response;
    }
}