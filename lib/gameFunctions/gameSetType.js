const { officerCheck, fetchGameFile, writeUpdatedFile } = require('../common.js');
const { categoryIds, sortingRoleIds } = require('../../secrets.json');

module.exports = {
    name: "gameSetType",

    async execute(interaction) {
        //only officers can do this
        if (!officerCheck(interaction.member)) {
            await interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //fetch game file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        await interaction.deferReply();

        //collect new game type
        let newType = interaction.values[0];

        //find sorting spots
        const role = interaction.guild.roles.cache.get(gameData.roleId);
        const channel = interaction.channel;
        let targetCategory;
        let targetSortingRole;
        switch (newType.toLowerCase().charAt(0)) {
            case "c":
                targetCategory = interaction.client.channels.cache.get(categoryIds.campaign);
                targetSortingRole = interaction.guild.roles.cache.get(sortingRoleIds.campaign);
                newType = "a campaign";
                break;
            case "s":
                targetCategory = interaction.client.channels.cache.get(categoryIds.series);
                targetSortingRole = interaction.guild.roles.cache.get(sortingRoleIds.series);
                newType = "a series";
                break;
            case "o":
                targetCategory = interaction.client.channels.cache.get(categoryIds.oneshot);
                targetSortingRole = interaction.guild.roles.cache.get(sortingRoleIds.oneshot);
                newType = "a one-shot";
                break;
            default:
                targetCategory = interaction.client.channels.cache.get(categoryIds.unsorted);
                targetSortingRole = interaction.guild.roles.cache.get(sortingRoleIds.unsorted);
                newType = "unsorted";
                break;
        }

        //move channel and role
        role.setPosition(targetSortingRole); //await shouldn't be necessary
        channel.setParent(targetCategory, { lockPermissions: false });

        //write updated game data
        gameData.gameType = newType;
        writeUpdatedFile(gameData);

        //respond publicly
        interaction.followUp(`${gameData.gameName} is now ${newType}.`);
        // ^ a oneshot, a campaign, a series, but not a unsorted
    }
}