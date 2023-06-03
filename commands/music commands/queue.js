const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the queue."),

    async execute(interaction) {
        await interaction.client.functions.get("showQueue").execute(interaction);
    }
}