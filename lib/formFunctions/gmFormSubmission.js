const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} = require("discord.js");
const { officialChatId } = require('../../secrets.json');

module.exports = {
    name: "gmFormSubmission",
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});

        //extract form data
        const formData = {
            userId: interaction.user.id,
            userTag: interaction.user.tag,
            gameName: interaction.fields.getTextInputValue('gmFormGameName'),
            gameType: interaction.fields.getTextInputValue('gmFormGameType'),
            gameSystem: interaction.fields.getTextInputValue('gmFormGameSystem'),
            gameDesiredColor: interaction.fields.getTextInputValue('gmFormRoleColor'),
            gameLocationAndDescription: interaction.fields.getTextInputValue('gmFormGameLocationAndDescription')
        };

        //build message container
        const embed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle("New Game Application")
            .setDescription(`
                **GM:** ${interaction.user} (${interaction.user.username})\n
                **Name:** ${formData.gameName}\n
                **Type:** ${formData.gameType}\n
                **System:** ${formData.gameSystem}\n
                **Color:** ${formData.gameDesiredColor}\n
                **Location and Description:**\n${formData.gameLocationAndDescription}\n
                `);

        //action row for approve/deny buttons
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`gmFormAccept${interaction.user.id}`)
                .setLabel("Approve")
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId(`gmFormConfirmDeny${interaction.user.id}`)
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
            );
        
        //write the interaction to disk to save it for future approval/denial
        const fs = require('fs');
        fs.writeFileSync(`./data/gameApplications/gmFormRequestBy_${interaction.user.id}.json`, JSON.stringify(formData));

        //send message
        const client = require("../../index.js").client;
        const channel = client.channels.cache.get(officialChatId);
        await channel.send({ embeds: [embed], components: [buttonRow] });
        await interaction.followUp({content: "Sent! The club officers have recieved your application and will review it shortly.", ephemeral: true});
    }
}