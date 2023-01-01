const { EmbedBuilder } = require('@discordjs/builders');
const { giveRole } = require("./gameGetRole");
const { fetchGameFile } = require("../common.js");
const { productionGuildId } = require("../../secrets.json");

module.exports = {
    name: "gameJoinAccept",

    async execute(interaction) {
        //the gm has clicked on the accept button in their dms (TODO: OR THE MESSAGE SENT IN THE GAME CHANNEL DUE TO AN ERROR SO ADD A GM CHECK!!)

        //gather channel/game id and get the file
        const regex = RegExp(/\d+/g);
        const ids = [regex.exec(interaction.customId)[0], regex.exec(interaction.customId)[0]];
        const channelId = ids[0];

        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            await interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        //only allow the GM to perfrom this action
        if (interaction.user.id != gameData.gmId) {
            await interaction.reply({ content: "You are not the GM of the game!", ephemeral: true });
            return;
        }

        //await interaction.deferReply();

        const guild = await interaction.client.guilds.fetch(productionGuildId);
        const member = await guild.members.fetch(ids[1]);
        console.log(`guild: ${guild}\nmember: ${member}\nuser tag: ${member.user.tag}`);

        //give the player the role
        const role = guild.roles.cache.get(gameData.roleId);
        //await giveRole(member, role, gameData, false);

        let message = interaction.message;
        console.log(`??: ${interaction.channelId}`)


        //remove the message containing the buttons and send a new one
        //build new embed
        const gmEmbed = new EmbedBuilder()
            .setTitle(`Approved Join Request`)
            .setDescription(`${member.user.tag} has successfully joined ${gameData.gameName}.`)
            .setColor(0x33ff88);

        try {
            await interaction.message.edit({ embeds: [gmEmbed], components: [] });
            console.log("ACCEPT EDIT SUCCESS")
        }
        catch (e) {
            console.log(`[WARN] Unable to edit a message to ${interaction.user.tag} accepting a player:\n${e.stack}`);
            //console.log(`[WARN] Unable to followup a DM to ${interaction.user.tag} accepting a player:\n${e.stack}`);
        }

        //dm the prospective player
        const playerEmbed = new EmbedBuilder()
            .setTitle(`Approved Join Request`)
            .setDescription(`The GM of ${gameData.gameName} has approved your request to join!`)
            .setColor(0x33ff88);
        try {
            await member.send({ embeds: [playerEmbed] }); //await shouldn't be needed
        }
        catch (e) {
            //same reason as above try/catch block
            console.log(`[WARN] Unable to DM ${member.user.tag} after being accepted as a player:\n${e}`);
        }
    }
}