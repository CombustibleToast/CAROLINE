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
        await interaction.client.functions.get("skip").execute(interaction);
    }
}