const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js")
const { officerCheck } = require('../common.js');

module.exports = {
    name: "gameConfirmDeletion",
    async execute(interaction) {
        //.setCustomId(`confirmGameDeletion${gameData.channelId}`)
        //this will be sent to official chat and will be clicked by an officer

        //gather channel/game id
        const channelId = /\d+/.exec(interaction.customId)[0];

        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //build modal for confirming deletion
        //build confirmation form
        const confirmModal = new ModalBuilder()
            .setCustomId(`gameDeletion${channelId}`)
            .setTitle('Confirm Game Deletion');

        //Row 1
        const reason = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gameDeletionReason')
            .setLabel("Reason for Deletion")
            .setStyle(TextInputStyle.Paragraph);
        const row1 = new ActionRowBuilder().addComponents(reason);

        //Row 2
        const deleteRole = new TextInputBuilder()
            .setRequired(false)
            .setCustomId('gameDeletionRoleDeletion')
            .setLabel("Delete Game's Role? (yes/no) (yes is default)")
            .setStyle(TextInputStyle.Short);
        const row2 = new ActionRowBuilder().addComponents(deleteRole);

        //Row 2
        const confirmation = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gameDeletionConfirmCheck')
            .setLabel("Type \"Confirm\"")
            .setStyle(TextInputStyle.Short);
        const row3 = new ActionRowBuilder().addComponents(confirmation);

        //push form
        confirmModal.addComponents(row1, row2, row3);
        await interaction.showModal(confirmModal);
    }
}