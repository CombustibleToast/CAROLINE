const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes playback."),

    async execute(interaction) {
        await interaction.client.functions.get("resumePlayback").execute(interaction);
    }
}