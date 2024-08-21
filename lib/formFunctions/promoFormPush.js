const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");

module.exports = {
    name: "promoFormPush",
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('promoFormSubmission')
            .setTitle('Promotional Form');
    
        //Row 1
        const rulesConfirm = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('promoRulesConfirmation')
            .setLabel("Have you read the rules for self-promos?")
            .setStyle(TextInputStyle.Short);
        const row1 = new ActionRowBuilder().addComponents(rulesConfirm);

        //Row 2
        const promoBody = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('promoBody')
        .setLabel("Enter the content of your promo.")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("This text will appear exactly as-is in the promo channel, so be careful!");
        const row2 = new ActionRowBuilder().addComponents(promoBody);
    
        modal.addComponents(row1, row2);
    
        await interaction.showModal(modal);
    }
}