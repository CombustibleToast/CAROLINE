
module.exports = {
    name: "resumePlayback",

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

        //don't do anything if the queue is empty
        if (loudspeakerClient.queue.length == 0) {
            return "The queue is empty, playback not resumed.";
        }

        switch (loudspeakerClient.player.state.status) {
            case "playing": 
                return "Already playing.";
            case "idle":
                interaction.client.functions.get("startNextSong").execute(loudspeakerClient);
                return "Beginning playback.";
            case "paused":
                loudspeakerClient.player.unpause();
                return "Playback resumed.";
        }
    }
}