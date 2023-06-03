
module.exports = {
    name: "nowPlaying",

    async execute(interaction) {
        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;

        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            return "There is no loudspeaker in your channel! Please use /join first.";
        }

        //collect queue
        const queue = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId).queue;

        //return first song and its link
        return `Now playing: [${queue[0].title}](<${queue[0].url}>)`
    }
}