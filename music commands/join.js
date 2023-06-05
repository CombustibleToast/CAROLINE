const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Assigns a loudspeaker to your channel.'),

    async execute(interaction) {
        await interaction.client.functions.get("join").execute(interaction);
    }
}