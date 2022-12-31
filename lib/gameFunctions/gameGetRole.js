const { fetchGameFile, writeUpdatedFile } = require('../common.js');
const { productionGuildId } = require('../../secrets.json');

module.exports = {
    name: "gameGetRole",
    async execute(interaction) {
        //button id is `gameGetRole${newChannel.id}`
        //anyone can use this button

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        //fetch the role
        const role = await interaction.guild.roles.fetch(gameData.roleId);

        //if the clicker already has the role, remove it from them
        if (gameData.participants.includes(interaction.user.id)) {
            //make sure not to remove the GM's role
            if (gameData.gmId == interaction.user.id) {
                interaction.followUp("You are the GM of this game! Your role has not been removed.");
                return;
            }
            //clicker is not the gm, remove the role
            this.removeRole(interaction.member, role, gameData, false);

            //respond
            interaction.followUp(`You have left ${gameData.gameName}.`);

            //if the game is closed, then the user can't see the response, so DM them as well
            if (gameData.status == "closed")
                await interaction.user.send(`You have left ${gameData.gameName}.`)
                    .catch(e => `[INFO] Unable to DM ${interaction.member.tag} after they left a game:\n${e}`);

            return;
        }

        //give the clicker the role
        this.giveRole(interaction.member, role, gameData, false);
        //reply to the user
        interaction.followUp(`You've joined ${gameData.gameName}!`);
    },

    async giveRole(member, role, gameData, message){
        await member.roles.add(role);
        if (gameData.participants.indexOf(member.user.id) == -1) {
            gameData.participants.push(member.id);
            writeUpdatedFile(gameData);
            writeUpdatedFile(gameData);
        }
        else{
            console.log(`[INFO] ${gameData.gameName} added ${member.user.tag} who was already in the participants list.`);
        }

        if(message){
            await member.send(message);
        }
    },

    async removeRole(member, role, gameData, message){
        await member.roles.remove(role);
        
        const index = gameData.participants.indexOf(member.id);
        gameData.participants.splice(index, 1);

        writeUpdatedFile(gameData);

        if(message)
            await member.send(message);
    }
}