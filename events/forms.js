const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

async function initGmAndReportForm(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("GM Campaign Form")
        .setDescription("GM Form: Fill out this form to open a game in the server.\nReport Form: Fill out this form to send an anonymous response about another user in the server.");

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("gmFormButton")
            .setLabel("GM Form")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("reportFormButton")
            .setLabel("Report Form")
            .setStyle(ButtonStyle.Danger)
        );

    await interaction.reply({ embeds: [embed], components: [actionRow] });
}

async function handleGmFormSubmission(interaction) {

}

async function pushGmForm(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('gmFormSubmit')
        .setTitle('GM Form Title');

    //Row 1
    const gameName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameName')
        .setLabel("Name of Game")
        .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(gameName);

    //Row 2
    //type of game 
    //3 buttons campaign series or oneshot

    //Row 3
    const gameLocation = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameLocation')
        .setLabel("Game Location (Online, Fairfax Campus, etc.)")
        .setStyle(TextInputStyle.Short);
    const row3 = new ActionRowBuilder().addComponents(gameLocation);

    //Row 4
    const gameSystem = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormSystem')
        .setLabel("System (D&D 5e, Lancer, PbtA, etc.)")
        .setStyle(TextInputStyle.Short);
    const row4 = new ActionRowBuilder().addComponents(gameSystem);

    //Row 5
    const roleColor = new TextInputBuilder()
        .setCustomId('gmFormRoleColor')
        .setLabel("Desired Role Color (One-Shots do not get roles)")
        .setStyle(TextInputStyle.Short);
    const row5 = new ActionRowBuilder().addComponents(roleColor);

    modal.addComponents(row1, row3, row4, row5);

    await interatcion.showModal(modal);
}

async function handleReportFormSubmission(interaction) {

}

async function pushReportForm(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('reportFormSubmit')
        .setTitle('Report Form');

    //Row 1
    const targetUser = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('reportFormTargetUser')
        .setLabel("Who are you reporting?")
        .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(targetUser);

    //Row 2
    const complaint = new TextInputBuilder()
        .setCustomId('reportForm')
        .setLabel("Why are you reporting them?")
        .setStyle(TextInputStyle.Paragraph);
    const row3 = new ActionRowBuilder().addComponents(complaint);

    modal.addComponents(targetUser, complaint);

    await interatcion.showModal(modal);
}