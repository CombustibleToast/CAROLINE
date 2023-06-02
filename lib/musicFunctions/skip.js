
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

        //if it's already playing, calling player.stop() will cause autoplay to remove the song and play the next automatically.
        //if it's paused, do the same but immediately pause playback.
            //i may need to set a temporary variable to let the autoplayer know to pause immediately.
        switch (loudspeakerClient.player.state.status) {
            default:
                loudspeakerClient.player.stop();
                //intentionally left out break;
            case "paused":
            case "autopaused":
                loudspeakerClient.player.pause();
                return "Current song skipped.";
        }
    }
}