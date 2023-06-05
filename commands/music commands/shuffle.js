const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the playlist."),

    async execute(interaction) { 
        await interaction.client.functions.get("shuffleQueue").execute(interaction);
    }
}