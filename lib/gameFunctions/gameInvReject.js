const { EmbedBuilder } = require("@discordjs/builders");
const { fetchGameFile } = require('../common.js');

module.exports = {
    name: 'gameInvReject',
    async execute(interaction) {
        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            await interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        //edit the invitation to remove the buttons
        const confirmEmbed = new EmbedBuilder()
            .setTitle(`Rejected Invitation`)
            .setDescription(`You have rejected the invitation to join ${gameData.gameName}.`)
            .setColor(0xff2233);
        try {
            await interaction.message.edit({ embeds: [confirmEmbed], components: [] }); //await shouldn't be needed
        }
        catch (e) {
            console.log(`[WARN] Unable to followup a DM to ${interaction.user.tag} accepting a player:\n${e}`);
            await interaction.followUp({ embeds: [confirmEmbed] });
        }

        //notify the recipient of success
        await interaction.followUp("Success!");
        
        //message GM of this
        const gm = interaction.client.guilds.cache.get(productionGuildId).members.cache.get(gameData.gmId).user;
        await gm.send(`${interaction.user.username} has declined your invitation to join ${gameData.gameName}.`);
    }
}