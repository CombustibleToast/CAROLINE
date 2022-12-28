const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { officialChatId, campaignCategoryId, seriesCategoryId, oneshotCategoryId, unsortedCategoryId, officerRoleId, everyoneId, clientid } = require('../../secrets.json');

module.exports = {
    name: "reportFormSubmission",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("User Report")
            .setDescription(
                `**User:** ${interaction.fields.getTextInputValue('reportFormTargetUser')}\n
                **Reason:** ${interaction.fields.getTextInputValue('reportFormReason')}`);

        const client = require("../../index.js").client;
        await interaction.guild.channels.fetch(officialChatId)
            .then(channel => channel.send({ embeds: [embed] }))
        //const channel = client.channels.cache.get("602596055711875083");
        //await channel.send({ embeds: [embed] });
        await interaction.followUp({ content: "Your report has been sent to the officers.", ephemeral: true });
    }
}