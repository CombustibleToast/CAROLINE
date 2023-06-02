const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clear the playlist")
        .addBooleanOption(option =>
            option
                .setName("clearcurrentlyplaying")
                .setDescription("Should the current song also be removed and skipped?")
                .setRequired(false)),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        const response = await interaction.client.functions.get("clearQueue").execute(interaction);
        await interaction.editReply(response);
    }
}