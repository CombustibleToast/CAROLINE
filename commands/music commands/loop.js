const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Sets the playlist on a loop. If not given a choice, on/off will be toggled.")
        .addBooleanOption(option =>
            option
                .setName('on')
                .setDescription("True turns loop on, False turns loop off.")),

    async execute(interaction) {
        await interaction.client.functions.get("loop").execute(interaction);
    }
}