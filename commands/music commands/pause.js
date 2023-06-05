const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses playback."),

    async execute(interaction) {
        await interaction.client.functions.get("pause").execute(interaction);
    }
}