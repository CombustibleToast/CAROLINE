const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("enqueue")
        .setDescription("Adds a song to the playlist.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Enter a Youtube video or playlist URL, or enter a search query.")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.client.functions.get("enqueue").execute(interaction);
    }
}