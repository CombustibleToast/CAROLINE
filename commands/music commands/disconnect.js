const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Disconnects the loudspeaker assigned to your channel'),
    
    async execute(interaction) {
        const voiceChannelId = interaction.member.voice.channelId;
        const loudspeakerList = interaction.client.loudspeakers
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(voiceChannelId, loudspeakerList);

        //There is no loudspeaker assigned to the channel
        if (loudspeakerAssignmentResult.status == "no vacancies" || loudspeakerAssignmentResult.status == "new assignment") {
            await interaction.reply({ content: "There is no loudspeaker assigned to your channel!", ephemeral: true });
            return;
        }

        //There is a loudspeaker assigned, destroy it
        interaction.client.functions.get("destroyLoudspeaker").execute(interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId));

        //respond to the user
        await interaction.reply({ content: "Loudspeaker disconnected.", ephemeral: true });
    }
}