const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const { officialChatId } = require('../../secrets.json');
const { fetchGameFile, officerCheck } = require('../common.js');

module.exports = {
    name: "gameDeletionRequest",
    async execute(interaction) {
        //.setCustomId(`gameDeletionRequest${newChannel.id}`)
        //only the GM and officers should be able to press this button

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }
        await interaction.deferReply({ ephemeral: true });

        //check if the user is the gm, deny if not (also allow officers to do this)
        if (interaction.user.id != gameData.gmId && !officerCheck(interaction.member)) {
            interaction.followUp({ content: "Only the GM may use this function.", ephemeral: true });
            return;
        }

        //build embed and confirm button to be sent in chat
        const officialChatConfirmationEmbed = new EmbedBuilder()
            .setColor(0xFFAA22)
            .setTitle("Game Deletion Request")
            .setDescription(`${interaction.user} has requested the deletion of ${interaction.channel}.\nPlease consult with them before confirming the deletion.`);
        const officialChatConfirmDeleteRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`gameConfirmDeletion${gameData.channelId}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel("Confirm Deletion"),
            new ButtonBuilder()
                .setCustomId(`gameRejectDeletion${gameData.channelId}`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Reject")
        );

        await interaction.guild.channels.fetch(officialChatId)
            .then(channel => channel.send({ embeds: [officialChatConfirmationEmbed], components: [officialChatConfirmDeleteRow] }));

        //reply to the clicker
        await interaction.followUp("Your request has been sent to the officers, they will be in touch shortly.");
    }
}