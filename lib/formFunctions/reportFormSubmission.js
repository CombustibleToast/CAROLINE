const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { officialChatId } = require('../../secrets.json');

module.exports = {
    name: "reportFormSubmission",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        //Check to see if y/n field is in fact y/n/empty
        //Guard clause
        const remainAnonymousField = interaction.fields.getTextInputValue('reportFormRemainAnonymous').toLowerCase().trim();
        console.log(`Remain anon field: ${remainAnonymousField}`);
        if(remainAnonymousField !== "" && remainAnonymousField !== "yes" && remainAnonymousField !== "no"){
            let response = `Your report has **NOT** been sent to the officers.\n`
            response += `Please put "yes" or "no" in the text box asking if you want to remain anonymous.\n`
            response += `That text is read by me (a bot) and I couldn't determine if you said yes or no.\n`
            response += `Here's a print out of everything you put in the form. Again, this has not been sent to the officers and nobody else has seen this.\n\n`
            
            response += `**User:** ${interaction.fields.getTextInputValue('reportFormTargetUser')}\n`
            response += `**Reason:** ${interaction.fields.getTextInputValue('reportFormReason')}\n`
            response += `**Anonimity (please fix your input here!):** ${interaction.fields.getTextInputValue('reportFormRemainAnonymous')}\n`
            response += `**Response:** ${interaction.fields.getTextInputValue('reportFormResponseRequest')}`
            await interaction.followUp({ content: response, ephemeral: true });
            return; //Important!! lol
        }

        //Get submitter username or anonymous
        let submitterUsername = remainAnonymousField.startsWith("no") ? `${interaction.user} (${interaction.user.username})` : "Anonymous";

        //Build Official Chat Embed
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("User Report")
            .setDescription(
                `**User:** ${interaction.fields.getTextInputValue('reportFormTargetUser')}\n
                **Reason:** ${interaction.fields.getTextInputValue('reportFormReason')}\n
                **Submitted by:** ${submitterUsername}\n
                **Response?:** ${interaction.fields.getTextInputValue('reportFormResponseRequest')}`);
        
        //Send Official Chat Embed
        await interaction.guild.channels.fetch(officialChatId)
            .then(channel => channel.send({ embeds: [embed] }))
        
        //Send Report Confirmation to User
        await interaction.followUp({ content: "Your report has been sent to the officers.", ephemeral: true });
    }
}