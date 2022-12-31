const { EmbedBuilder } = require('@discordjs/builders');
const { productionGuildId } = require('../../secrets.json');
const { fetchGameFile } = require('../common.js');

module.exports = {
    name: "gameJoinDeny",

    async execute(interaction) {
        //The gm has just clicked deny on allowing someone into their game.

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const userId = /\d+/.exec(interaction.customId)[1]; //the second snowflake is the user's id
        const user = interaction.client.guilds.cache.get(productionGuildId).members.cache.get(userId).user;

        let gameName = fetchGameFile(channelId); //not getting the game data is not a huge issue
        gameName = gameName == undefined ? "a game" : gameName.gameName;

        await interaction.deferReply();

        //remove the message containing the buttons and send a new one
        //build new embed
        const embed = new EmbedBuilder()
            .setTitle(`Rejected Join Request`)
            .setDescription(`Successfully rejected ${user.tag}.`)
            .setColor(0x5588bb);
        try{
            await interaction.followUp({embeds: [embed]});
            await interaction.message.delete();
        }
        catch(e){
            //if for some reason they closed their dms before clicking the button this won't work so i'm catching it here
            console.log(`[WARN] Unable to followup a DM to ${interaction.user.tag} rejecting a player.`);
        }

        //dm the prospective player
        try{
            await user.send(`Your request to join ${gameName} has been rejected.`);
        }
        catch{
            //same reason as above try/catch block
            console.log(`[WARN] Unable to DM ${interaction.user.tag} after being rejected as a player.`);
        }
    }
}