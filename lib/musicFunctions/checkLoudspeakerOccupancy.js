
module.exports = {
	name: "checkLoudspeakerOccupancy",

	async execute(interaction) {
        const loudspeakerList = interaction.loudspeakers;
        const channelId = interaction.member.voice.channelId;
        const assignmentResult = interaction.client.functions.get("assignLoudspeaker").execute(channelId, loudspeakerList);

        if(assignmentResult.status == "already assigned")
            return true;

        return false;
    }
}