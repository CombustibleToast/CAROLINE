const { fetchGameFile, writeUpdatedFile } = require('../common.js');

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
            await interaction.member.roles.remove(role);

            //update gamefile
            const index = gameData.participants.indexOf(interaction.user.id);
            gameData.participants.splice(index, 1);

            writeUpdatedFile(gameData);

            //respond
            interaction.followUp(`You have left ${gameData.gameName}.`);

            //if the game is closed, then the user can't see the response, so DM them as well
            if (gameData.status == "closed")
                interaction.user.send(`You have left ${gameData.gameName}.`)

            return;
        }

        //give the clicker the role
        await interaction.member.roles.add(role);
        gameData.participants.push(interaction.user.id);
        writeUpdatedFile(gameData);
        //reply to the user
        interaction.followUp(`You've joined ${gameData.gameName}!`);
    }
}