const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");

module.exports = {
    name: "pushGmForm",
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('gmFormSubmission')
            .setTitle('New Game Form');
    
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
    
        /*"Currently, you cannot use StringSelectMenuBuilders or ButtonBuilders in modal action rows builders." bruh
        const gameType = new StringSelectMenuBuilder()
            .setCustomId('gmFormGameTypeSelectionMenu')
            .setPlaceholder("Nothing Selected")
            .addOptions(
                {
                    label: "Campaign",
                    description: "Longform games that typically have many sessions throughout and between semesters.",
                    value: "first_option"
                },
                {
                    label: "Series",
                    description: "A group of one-shots that may or may not be connected in story and/or characters.",
                    value: "second_option"
                },
                {
                    label: "One-Shot",
                    description: "A single, one-off session of a game.",
                    value: "third_option"
                }
            );
            const row2 = new ActionRowBuilder().addComponents(gameType);*/
    
        //Row 3
        const gameSystem = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gmFormGameSystem')
            .setLabel("System (D&D 5e, Lancer, PbtA, etc.)")
            .setStyle(TextInputStyle.Short);
        const row3 = new ActionRowBuilder().addComponents(gameSystem);
    
        //Row 4
        const roleColor = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('gmFormRoleColor')
            .setLabel("Desired Role Color in Hex (RRGGBB)")
            .setStyle(TextInputStyle.Short);
        const row4 = new ActionRowBuilder().addComponents(roleColor);
    
        //Row 5
        const gameLocation = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameLocationAndDescription')
        .setLabel("Location of Game and Game Description")
        .setStyle(TextInputStyle.Paragraph);
        const row5 = new ActionRowBuilder().addComponents(gameLocation);
    
        modal.addComponents(row1, row2, row3, row4, row5);
        await interaction.showModal(modal);
    }
}