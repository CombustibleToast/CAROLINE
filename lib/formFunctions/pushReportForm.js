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

        //Row 3
        const selfIdentification = new TextInputBuilder()
            .setRequired(false)
            .setCustomId('reportFormRemainAnonymous')
            .setLabel("Do you want this report to be anonymous?")
            .setPlaceholder("Yes/No. Defaults to yes.")
            .setStyle(TextInputStyle.Short);
        const row3 = new ActionRowBuilder().addComponents(selfIdentification);

        //Row 4
        const responseRequest = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('reportFormResponseRequest')
            .setLabel("Would you like a response from the officers?")
            .setPlaceholder("Yes/No. Responses are not possible for anonymous reports.")
            .setStyle(TextInputStyle.Short);
        const row4 = new ActionRowBuilder().addComponents(responseRequest);
    
        modal.addComponents(row1, row2, row3, row4);
    
        await interaction.showModal(modal);
    }
}