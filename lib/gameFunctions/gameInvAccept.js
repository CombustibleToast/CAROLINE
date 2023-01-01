const { productionGuildId } = require('../../secrets.json');
const { giveRole } = require('./gameGetRole.js');
const { fetchGameFile } = require('../common.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'gameInvAccept',
    async execute(interaction) {
        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        interaction.deferReply();

        //fetch the guild, game role, and the member associated with this user
        const guild = interaction.client.guilds.cache.get(productionGuildId);
        const member = guild.members.cache.get(interaction.user.id);
        const role = guild.roles.cache.get(gameData.roleId);

        //give role
        giveRole(member, role, gameData, false);

        //edit the invitation to remove the buttons
        const confirmEmbed = new EmbedBuilder()
            .setTitle(`Accepted Invitation`)
            .setDescription(`You have successfully joined ${gameData.gameName}.`)
            .setColor(0x33ff88);
        try {
            await interaction.message.edit({ embeds: [confirmEmbed], components: [] }); //currently this doesn't work (see gameJoinReq.js)
        }
        catch (e) {
            console.log(`[WARN] Unable to followup a DM to ${interaction.user.tag} accepting a player:\n${e}`);
            interaction.followUp({ embeds: [confirmEmbed] });
        }
    }
}