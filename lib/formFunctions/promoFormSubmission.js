const { EmbedBuilder } = require("discord.js");
const { officialChatId } = require('../../secrets.json');

module.exports = {
    name: "promoFormSubmission",
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        //Collect Data
        const confirmField = interaction.fields.getTextInputValue('promoRulesConfirmation').toLowerCase().trim();
        const promoBody = interaction.fields.getTextInputValue('promoBody');

        //Guard clause
        if(confirmField != 'tomato'){
            let reply = "You did not pass the confirmation test! Please go back and read the rules before submitting."
            reply += `\nHere is your inputted text back:\n${promoBody}`
            await interaction.followUp(reply);
            return;
        }

        //Get submitter username
        const submitterUsername = `${interaction.user} (${interaction.user.username})`;

        //Build Official Chat Embed
        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle("Promo Request")
            .setDescription(
                `**Submitted by:** ${submitterUsername}\n**Body (for copy-pasting):**\n\n \`\`\`\n${promoBody}\`\`\``);
        
        //Send Official Chat Embed
        await interaction.guild.channels.fetch(officialChatId)
            .then(channel => channel.send({ embeds: [embed] }));
            // .then(channel => channel.send({content: `Promo Preview:\n${promoBody}`, embeds: [embed]}));
        
        //Send Confirmation to User
        await interaction.followUp({ content: "Your submission has been sent to the officers!", ephemeral: true });
    }
}