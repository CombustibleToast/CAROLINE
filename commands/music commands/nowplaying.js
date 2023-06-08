const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Displays the current song."),

    async execute(interaction) {
        await interaction.client.functions.get("nowPlaying").execute(interaction);
    }
}