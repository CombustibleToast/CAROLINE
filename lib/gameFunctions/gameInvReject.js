const { EmbedBuilder } = require("@discordjs/builders");
const { fetchGameFile } = require('../common.js');

module.exports = {
    name: 'gameInvReject',
    async execute(interaction) {
        await interaction.deferReply();

        //gather channel/game id and get the file
        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

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
            interaction.followUp({embeds: [confirmEmbed]});
        }
    }
}