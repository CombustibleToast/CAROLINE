const { ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, EmbedBuilder, TextInputAssertions, TextInputBuilder, TextInputStyle } = require("discord.js");

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
    const officialChat = new TextChannel(562085662954749992); //no idea how to do this
    const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle("New Game Request")
        .setDescription(
            `**Name:** ${interaction.fields.getTextInputValue('gmFormGameName')}\n
            **Type:** ${interaction.fields.getTextInputValue('gmFormGameType')}\n
            **Location:** ${interaction.fields.getTextInputValue('gmFormGameLocation')}\n
            **System:** ${interaction.fields.getTextInputValue('gmFormGameSystem')}\n
            **Color:** ${interaction.fields.getTextInputValue('gmFormRoleColor')}\n
            **GM:** ${interaction.user.username}`);

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('officerConfirmGmFormSubmission')
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('officerDenyGmFormSubmission')
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        )

    officialChat.send({ embeds: [embed], components: [buttonRow] });
}

async function handleGmFormAccept() {

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
    const gameType = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameType')
        .setLabel("Type of Game (Campaign, One-Shot, or Series)")
        .setStyle(TextInputStyle.Short);
    const row2 = new ActionRowBuilder().addComponents(gameType);

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
        .setCustomId('gmFormGameSystem')
        .setLabel("System (D&D 5e, Lancer, PbtA, etc.)")
        .setStyle(TextInputStyle.Short);
    const row4 = new ActionRowBuilder().addComponents(gameSystem);

    //Row 5
    const roleColor = new TextInputBuilder()
        .setCustomId('gmFormRoleColor')
        .setLabel("Desired Role Color (One-Shots do not get roles)")
        .setStyle(TextInputStyle.Short);
    const row5 = new ActionRowBuilder().addComponents(roleColor);

    modal.addComponents(row1, row2, row3, row4, row5);

    await interaction.showModal(modal);
}

async function handleReportFormSubmission(interaction) {
    const officialChat = new TextChannel(562085662954749992); //no idea how to do this
    const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("User Report")
        .setDescription(
            `**User:** ${interaction.fields.getTextInputValue('reportFormTargetUser')}\n
            **Reason:** ${interaction.fields.getTextInputValue('reportFormReason')}`);

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('officerConfirmGmFormSubmission')
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId('officerDenyGmFormSubmission')
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        )

    officialChat.send({ embeds: [embed], components: [buttonRow] });
}

async function pushReportForm(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('reportFormSubmit')
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
        .setCustomId('reportFormReason')
        .setLabel("Why are you reporting them?")
        .setStyle(TextInputStyle.Paragraph);
    const row3 = new ActionRowBuilder().addComponents(complaint);

    modal.addComponents(targetUser, complaint);

    await interatcion.showModal(modal);
}