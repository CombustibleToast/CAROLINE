const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips current song.")
        .addBooleanOption(option =>
            option
                .setName('pause')
                .setDescription("(Default is false/no) Should the next song be paused?")),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        const response = await interaction.client.functions.get("skip").execute(interaction);
        await interaction.editReply(response);
    }
}