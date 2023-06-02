const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes playback."),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        const response = await interaction.client.functions.get("resumePlayback").execute(interaction);
        await interaction.editReply(response);
    }
}