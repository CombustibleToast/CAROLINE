const { EmbedBuilder } = require('@discordjs/builders');
const { productionGuildId } = require('../../secrets.json');
const { fetchGameFile } = require('../common.js');

module.exports = {
    name: "gameJoinDeny",

    async execute(interaction) {
        //The gm has just clicked deny on allowing someone into their game.

        //gather channel/game id and get the file
        const regex = RegExp(/\d+/g);
        const ids = [regex.exec(interaction.customId)[0], regex.exec(interaction.customId)[0]];
        const channelId = ids[0];

        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            await interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }
        const guild = interaction.client.guilds.cache.get(productionGuildId)
        const member = await guild.members.fetch(ids[1]); //for some reason you can't just get the user. you have to use member.user after getting member instead of just getting the user now

        await interaction.deferReply();

        //remove the message containing the buttons and send a new one
        //build new embed
        const embed = new EmbedBuilder()
            .setTitle(`Join Request Denied`)
            .setDescription(`Successfully rejected ${member.user.tag}.`)
            .setColor(0x5588bb);
        try{
            await interaction.message.edit({ embeds: [embed], components: [] });
            console.log("DENY EDIT SUCCESS");
        }
        catch(e){
            console.log(`[WARN] Unable to edit a message to ${interaction.user.tag} rejecting a player:\n${e.stack}`);
        }

        //dm the prospective player
        try{
            await user.send(`Your request to join ${gameData.gameName} has been rejected.`);
        }
        catch{
            //same reason as above try/catch block
            console.log(`[WARN] Unable to DM ${interaction.user.tag} after being rejected as a player.:\n${e.stack}`);
        }
    }
}