const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("enqueue")
        .setDescription("Add a song to the playlist.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Enter a Youtube video or playlist URL, or enter a search query.")
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.client.functions.get("enqueue").execute(interaction);
    }
}