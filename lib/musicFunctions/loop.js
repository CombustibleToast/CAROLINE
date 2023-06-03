
module.exports = {
    name: "loop",

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

        //if an option is given, set it to that
        const choice = interaction.options.getBoolean('on')
        if (choice != undefined) {
            //special message if loop was already set to that value
            if (choice == loudspeakerClient.player.loop)
                return `Loop was already ${choice ? "on" : "off"}.`;
            loudspeakerClient.player.loop = choice;
        }
        //otherwise, toggle the loop
        else
            loudspeakerClient.player.loop = !loudspeakerClient.player.loop; //i'm going to hope that !undefined becomes true

        return `Loop was turned ${loudspeakerClient.player.loop ? "on" : "off"}.`;
    }
}