const { categoryIds } = require('../../secrets.json');
const { fetchGameFile, writeUpdatedFile, officerCheck } = require('../common.js');

module.exports = {
    name: "gameToggleJoinable",
    async execute(interaction) {
        //button id is `gameToggleJoinable${newChannel.id}`
        //only the GM can press this button

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        //check if the user is the gm, deny if not (also allow officers to do this)
        if (interaction.user.id != gameData.gmId && !officerCheck(interaction.member)) {
            interaction.followUp("Only the GM may use this function.");
            return;
        }

        //if the campaign is freejoin, move it to restricted, and visa versa
        if (gameData.joinability == "free") {
            gameData.joinability = "restricted";
        }
        else {//gameData.joinability == "restricted"
            gameData.joinability = "free";
        }

        //reply to the gm
        await interaction.followUp(`${gameData.gameName} now has ${gameData.joinability} entry.`);

        //update the file
        writeUpdatedFile(gameData);
    }
}