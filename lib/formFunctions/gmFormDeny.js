const { EmbedBuilder } = require("discord.js");
const { officerCheck } = require('../common.js');

module.exports = {
    name: "gmFormDeny",
    async execute(interaction) {
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //check to see if the deletion was confirmed
        if (interaction.fields.getTextInputValue('gmDenyConfirmCheck').toLowerCase() != "confirm") {
            await interaction.reply({ content: "You failed to pass the confirmation. The application was not deleted.", ephemeral: true });
            return;
        }

        await interaction.deferReply();

        //collect userid and tag
        const userid = /\d+/.exec(interaction.customId)[0];
        const deniedUser = await interaction.guild.members.fetch(userid);

        //build embed
        let officialChatDenyConfirmationEmbed;
        try {
            officialChatDenyConfirmationEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`${interaction.user.tag} has denied the application submitted by ${deniedUser.user.tag}`);
        }
        catch {
            officialChatDenyConfirmationEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`${interaction.user.tag} has denied an application. The applying user could not be found.`);
        }

        //attempt to delete the file
        const reason = interaction.fields.getTextInputValue('gmDenyReason');
        const fs = require('fs');
        try {
            fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`);
            officialChatDenyConfirmationEmbed.setDescription(`Reason: ${reason}\n\nFile deleted succesfully.`);
        }
        catch (e) {
            officialChatDenyConfirmationEmbed.setDescription(`Reason: ${reason}\n\nFile could not be found so I guess it already didn't exist lol.`);
        }

        //post official chat embed
        await interaction.followUp({ embeds: [officialChatDenyConfirmationEmbed] });

        //build embed for dming the user
        const deniedUserDMEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Game Application Denied")
            .setDescription(`Your application to create a new game has been denied for the following reason:\n\n${reason}\n\nPlease contact an officer for more information.`);

        //attempt to DM the user
        try {
            deniedUser.send({ embeds: [deniedUserDMEmbed] });
        }
        catch (e) {
            interaction.channel.send(`${deniedUser.tag} could not be DMed.\n${e}`);
        }
    }
}