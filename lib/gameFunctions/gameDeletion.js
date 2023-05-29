const { EmbedBuilder } = require("discord.js");
const { fetchGameFile, officerCheck } = require('../common.js');

module.exports = {
    name: "gameDeletion",
    async execute(interaction) {
        //delete the game after everything is confirmed
        //only an officer can do this

        //only allow officers to perform this action
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //the deleter must confirm the deletion
        if (interaction.fields.getTextInputValue('gameDeletionConfirmCheck').toLowerCase() != "confirm") {
            interaction.reply({ content: "You failed to confirm the deletion. The game has not been deleted.", ephemeral: true });
            return;
        }

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena if you believe this is an issue.`);
            return;
        }

        //checks passed
        await interaction.deferReply();
        let response = "";

        //delete the role if requested
        const deleteRoleString = interaction.fields.getTextInputValue('gameDeletionRoleDeletion');
        if(deleteRoleString.toLowerCase() == 'yes'){
            try {
                await interaction.guild.roles.fetch(gameData.roleId)
                    .then(role => interaction.guild.roles.delete(role, interaction.fields.getTextInputValue('gameDeletionReason')));
                response += "Role deleted.\n"
            }
            catch (e) {
                console.error(`[WARN] Could not delete role ${gameData.roleId}:\n${e}`)
                response += "There was an error when deleting the role (ping Ena about this lol).\n"
            }
        }
        else
            response += "Role was not deleted.\n"

        //delete the channel
        try {
            await interaction.guild.channels.fetch(gameData.channelId)
                .then(channel => interaction.guild.channels.delete(channel, interaction.fields.getTextInputValue('gameDeletionReason')));
            response += "Channel deleted.\n"
        }
        catch (e) {
            console.error(`[WARN] Could not delete channel ${gameData.roleId}:\n${e}`)
            response += "There was an error when deleting the channel (ping Ena about this lol).\n"
        }

        //archive the game data because why not
        const fs = require('fs');
        const oldPath = `./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`;
        const newPath = `./data/archivedGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`;
        fs.renameSync(oldPath, newPath);

        //send a notification in official chat
        const channelDeletedEmbed = new EmbedBuilder()
            .setColor(0x44EE22)
            .setTitle(`${gameData.gameName} has been deleted.`)
            .setDescription(`
                Log:\n${response}\n\n
                Deletion confirmed by ${interaction.user.toString()}.\n\n
                Reason:\n${interaction.fields.getTextInputValue('gameDeletionReason')}`);
        interaction.followUp({ embeds: [channelDeletedEmbed] });

        //delete the original message
        await interaction.message.delete();
    }
}