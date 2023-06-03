
module.exports = {
    name: "skip",

    /**
     * Skips the current playing song by calling player.stop(). The autoplayer will immediately play the next song in the queue if there is one.
     * If the playback is paused, it shoud also immediately pause the playback of the new song.
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {
        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;

        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            return "There is no loudspeaker in your channel! Please use /join first.";
        }

        //collect loudspeaker
        const loudspeakerClient = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId);

        //do nothing if the queue is empty
        if(loudspeakerClient.queue.length == 0)
            return "The queue is empty; there is nothing to skip."

        let response = `Current song skipped.`;
        if(loudspeakerClient.queue.length > 1)
            response += `\nThe next song is [${loudspeakerClient.queue[1].title}](<${loudspeakerClient.queue[1].url}>).`;

        //start playing the song really quick so that stop() sets the player to the idle state, triggering autoplay
        loudspeakerClient.player.unpause();
        //if the user wants the next song to be paused, set that now
        //if there's no other song in the list, don't bother doing this
        if(interaction.options.getBoolean('pause') && loudspeakerClient.queue.length > 1){
            loudspeakerClient.player.pauseOnNextPlay = true;
            response += "\nThe next song will be paused.";
        }
        //edge case: if loop is on, queue has exactly 1 song, and skip is used, the song should not be readded to the queue
        if(loudspeakerClient.queue.length == 1 && loudspeakerClient.player.loop)
            loudspeakerClient.player.loopNoReadd = true;
        
        await loudspeakerClient.player.stop();
        return response;
    }
}