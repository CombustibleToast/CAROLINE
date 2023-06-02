
module.exports = {
    name: "pause",

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

        //do nothing if it's already paused or idle
        switch (loudspeakerClient.player.state.status) {
            case "paused":
            case "autopaused":
                return "Already paused.";
            case "idle":
                return "Nothing is playing.";
            default:
                loudspeakerClient.player.pause();
                return "Playback paused.";
        }
    }
}