const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears the playlist.")
        .addBooleanOption(option =>
            option
                .setName("clearcurrentlyplaying")
                .setDescription("Should the current song also be removed and skipped?")
                .setRequired(false)),

    async execute(interaction) {
        await interaction.client.functions.get("clearQueue").execute(interaction);
    }
}