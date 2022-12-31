const { ActionRowBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, } = require("discord.js");
const { officerCheck } = require('../common.js');

module.exports = {
    name: "gmFormConfirmDeny",
    async execute(interaction) {
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //collect userid
        const userid = /\d+/.exec(interaction.customId)[0];
    
        //check if application exists
        const fs = require('fs');
        if(!fs.existsSync(`./data/gameApplications/gmFormRequestBy_${userid}`)){
            const nonExistantMessageEmbed = new EmbedBuilder()
                .setColor(0x999900)
                .setTitle("Application doesn't exist or was not found.");
            await interaction.reply({embeds: [nonExistantMessageEmbed], ephemeral: true});
            return;
        }
        
        //build confirmation form
        const modal = new ModalBuilder()
            .setCustomId(`gmFormDeny${userid}`)
            .setTitle('Deny Game Application');
    
        //Row 1
        const reason = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gmDenyReason')
            .setLabel("Reason for Denial")
            .setStyle(TextInputStyle.Paragraph);
        const row1 = new ActionRowBuilder().addComponents(reason);
    
        //Row 2
        const confirmation = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gmDenyConfirmCheck')
            .setLabel("Type \"Confirm\"")
            .setStyle(TextInputStyle.Short);
        const row2 = new ActionRowBuilder().addComponents(confirmation);
        
        //push form
        modal.addComponents(row1, row2);
        await interaction.showModal(modal);
    }
}