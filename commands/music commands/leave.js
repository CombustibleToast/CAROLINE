const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Disconnects a loudspeaker from your channel."),

    async execute(interaction) {
        await interaction.client.functions.get("leave").execute(interaction);
    }
}