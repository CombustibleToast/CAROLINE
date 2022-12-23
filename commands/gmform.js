const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    //command definition for discord API
    data: generateForm()
}

function generateForm() {
    const modal = new ModalBuilder()
        .setCustomId('GM Form')
        .setTitle('GM Form Title');

    //Row 1
    const gameName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gameName')
        .setLabel("Name of Game")
        .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(gameName);

    //Row 2
    //type of game 
    //3 buttons campaign series or oneshot

    //Row 3
    const gameLocation = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gameLocation')
        .setLabel("Game Location (Online, Fairfax Campus, etc.)")
        .setStyle(TextInputStyle.Short);
    const row3 = new ActionRowBuilder().addComponents(gameLocation);

    //Row 4
    const gameSystem = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gameSystem')
        .setLabel("System (D&D 5e, Lancer, PbtA, etc.)")
        .setStyle(TextInputStyle.Short);
    const row4 = new ActionRowBuilder().addComponents(gameSystem);

    //Row 5
    const roleColor = new TextInputBuilder()
        .setCustomId('roleColor')
        .setLabel("Desired Role Color (One-Shots do not get roles)")
        .setStyle(TextInputStyle.Short);
    const row5 = new ActionRowBuilder().addComponents(roleColor);

    modal.addComponents(row1, row3, row4, row5);


}