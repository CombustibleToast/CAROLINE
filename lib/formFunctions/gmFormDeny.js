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

        //collect user
        const userid = /\d+/.exec(interaction.customId)[0];
        const deniedUser = await interaction.guild.members.fetch(userid);

        //build embed
        const confirmationEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Application Denied`);
        let response = "";
        try{
            response += `An application submitted by ${deniedUser.toString()} has been denied by ${interaction.user.toString()}.\n`;
        }
        catch{
            response += `An application submitted by an unknown user has been denied by ${interaction.user.toString()}.\n`;
        }

        //add reason to response
        response += `Reason:\n${interaction.fields.getTextInputValue('gmDenyReason')}\n\n`

        //attempt to delete the file
        const fs = require('fs');
        try {
            fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`);
            response += `File deleted succesfully.`;
        }
        catch (e) {
            response += `File could not be found so I guess it already didn't exist lol.`;
        }

        //add response to embed
        confirmationEmbed.setDescription(response);

        //post official chat embed
        await interaction.followUp({ embeds: [confirmationEmbed] });

        //build embed for dming the user
        const deniedUserDMEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle("Game Application Denied")
            .setDescription(`Your application to create a new game has been denied for the following reason:\n\n${interaction.fields.getTextInputValue('gmDenyReason')}\n\nPlease contact an officer for more information.`);

        //attempt to DM the user
        try {
            deniedUser.send({ embeds: [deniedUserDMEmbed] });
        }
        catch (e) {
            interaction.channel.send(`The applicant could not be DMed.\n${e}`);
        }
    }
}