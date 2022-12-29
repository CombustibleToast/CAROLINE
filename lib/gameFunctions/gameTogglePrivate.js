//const { campaignCategoryId, seriesCategoryId, oneshotCategoryId, unsortedCategoryId, closedGameCategoryId } = require('../../secrets.json');
const { categoryIds } = require('../../secrets.json');
const { fetchGameFile, writeUpdatedFile, officerCheck } = require('../common.js');

module.exports = {
    name: "gameTogglePrivate",
    async execute(interaction) {
        //button id is `gameTogglePrivate${newChannel.id}`
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

        //move the channel if it's a campaign
        /* this server policy no longer applies
        if (gameData.gameType.toLowerCase().charAt(0) != "c") {
            interaction.followUp("Only campaigns can be closed.");
            return;
        }*/

        //if the campaign is open, move it to closed, and visa versa
        if (gameData.status == "open") {
            //interaction.channel.permissionOverwrites.edit(everyoneId, {'ViewChannel': false});
            interaction.channel.permissionOverwrites.edit(interaction.guild, {'ViewChannel': false}); //interaction.guild snowflake == @everyone snowflake
            await interaction.guild.channels.fetch(categoryIds.closedGame)
                .then(category => interaction.channel.setParent(category, { lockPermissions: false }));
            gameData.status = "closed";
        }
        else {//gameData.status == "closed"
            interaction.channel.permissionOverwrites.edit(everyoneId, {'ViewChannel': true});
            let targetCategory;
            switch (gameData.gameType.toLowerCase().charAt(0)) {
                case "c": targetCategory = categoryIds.campaign; break;
                case "s": targetCategory = categoryIds.series; break;
                case "o": targetCategory = categoryIds.oneshot; break;
                default: targetCategory = categoryIds.unsorted; break;
            }
            await interaction.guild.channels.fetch(targetCategory)
                .then(category => interaction.channel.setParent(category, { lockPermissions: false }));
            gameData.status = "open";
        }

        //reply to the gm
        interaction.followUp(`${gameData.gameName} is now ${gameData.status}.`);

        //update the file
        writeUpdatedFile(gameData);
    }
}