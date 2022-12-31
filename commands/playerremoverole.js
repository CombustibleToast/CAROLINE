const { SlashCommandBuilder } = require("discord.js");
const { officerCheck, fetchGameFile, writeUpdatedFile } = require("../lib/common.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playerremoverole')
        .setDescription("Remove a role from a user. Officer use only.")
        .addUserOption(option =>
            option.setName('target')
                .setDescription("The user whose role should be removed.")
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('gamechannel')
                .setDescription("The channel that is associated with the role to be removed.")
                .setRequired(true)),


    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        //only officers are allowed to use this command
        if (!officerCheck(interaction.member)) {
            interaction.followUp({ content: "You are not authorized to use this command.", ephemeral: true });
            return;
        }

        //collect member and fetch gameData
        const member = interaction.options.getMember('target');
        const gameData = fetchGameFile(interaction.options.getChannel('gamechannel').id);

        if (!gameData) {
            interaction.followUp({ content: "Could not find the file of the game. Please contact Ena if you think this is an issue.", ephemeral: true });
            return;
        }

        //return if the user doesn't have the role
        if (!gameData.participants.includes(member.id)) {
            interaction.followUp("User doesn't appear to have the role. If they do, go ahead and remove it manually but tell Ena.");
            return;
        }

        //try to remove the member's role
        try {
            interaction.guild.roles.fetch(gameData.roleId)
                .then(role => member.roles.remove(role));
        }
        catch (e) {
            interaction.followUp(`Could not remove the role:\n${e}`);
            return;
        }

        //remove the member from the participants list and rewrite the file
        const index = gameData.participants.indexOf(interaction.user.id);
        console.log(`before splice: ${gameData.participants}`)
        if (index > -1) gameData.participants.splice(index, 1);
        else console.log(`Unable to remove ${member.tag} from ${gameData.gameName} participant list.`);
        console.log(`after splice: ${gameData.participants}`)
        writeUpdatedFile(gameData);

        interaction.followUp("Successfully removed.");
    }
}