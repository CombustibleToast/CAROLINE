const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");

module.exports = {
    name: "enqueueModal",
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('enqueue')
            .setTitle('Enqueue a Song, Playlist, or Search Term');
    
        //form row
        const query = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('query')
            .setLabel("Video URL, Playlist URL, or Search")
            .setStyle(TextInputStyle.Short);
        const row1 = new ActionRowBuilder().addComponents(query);
    
        modal.addComponents(row1);
        await interaction.showModal(modal);
    }
}