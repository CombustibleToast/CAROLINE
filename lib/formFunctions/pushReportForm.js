const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");

module.exports = {
    name: "pushReportForm",
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('reportFormSubmission')
            .setTitle('Report Form');
    
        //Row 1
        const targetUser = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('reportFormTargetUser')
            .setLabel("Who are you reporting? (E.g. Glanis#3784)")
            .setStyle(TextInputStyle.Short);
        const row1 = new ActionRowBuilder().addComponents(targetUser);
    
        //Row 2
        const complaint = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('reportFormReason')
            .setLabel("Why are you reporting them?")
            .setStyle(TextInputStyle.Paragraph);
        const row2 = new ActionRowBuilder().addComponents(complaint);
    
        modal.addComponents(row1, row2);
    
        await interaction.showModal(modal);
    }
}