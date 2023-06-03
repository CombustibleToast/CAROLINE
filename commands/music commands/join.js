const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Assigns a loudspeaker to your channel.'),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        //attempt to connect a loudspeaker
        const result = await interaction.client.functions.get("connectLoudspeaker").execute(interaction);

        //respond to the user
        if (result.status == "no vacancies")
            await interaction.followUp({ content: "Unfortunately there are no vacant loudspeakers at this time.", ephemeral: true });

        if (result.status == "already assigned")
            await interaction.followUp({ content: "There is already a loudspeaker in your channel.", ephemeral: true });

        if (result.status == "new assignment")
            await interaction.followUp({ content: "Assigned a loudspeaker to your channel.", ephemeral: true });
    }
}