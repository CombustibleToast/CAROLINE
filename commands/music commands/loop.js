const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Sets the playlist on a loop. If not given a choice, it will be toggled.")
        .addBooleanOption(option =>
            option
                .setName('on')
                .setDescription("True turns loop on, False turns loop off.")),

    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        const response = await interaction.client.functions.get("loop").execute(interaction);
        await interaction.followUp(response);
    }
}