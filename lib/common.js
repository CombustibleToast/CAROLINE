const { officerRoleId } = require('../secrets.json');

module.exports = {
    fetchGameFile(channelId) {
        fs = require('fs');
        //`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${newChannel.id}.json`
        const gameFiles = fs.readdirSync("./data/existingGames").filter(file => file.endsWith(`${channelId}.json`));
        if (gameFiles.length < 1)
            return undefined;
        return JSON.parse(fs.readFileSync(`./data/existingGames/${gameFiles[0]}`));
    },

    writeUpdatedFile(gameData) {
        const fs = require('fs');
        try {
            fs.writeFileSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`, JSON.stringify(gameData));
        }
        catch (e) {
            console.error(`COULD NOT WRITE UPDATED GAME FILE FOR ${gameData}`)
        }
    },

    officerCheck(member) {
        return member.roles.cache.has(officerRoleId);
    }
}