const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");
const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "enqueueModal",
    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;
        
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