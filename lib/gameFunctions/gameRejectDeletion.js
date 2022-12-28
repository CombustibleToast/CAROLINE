const { EmbedBuilder } = require('@discordjs/builders');
const {fetchGameFile, officerCheck} = require('../common.js');

module.exports = {
    name: "gameRejectDeletion",
    async execute(interaction){
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }
        
        //delete the rejected delete request
        interaction.message.delete();

        //fetch game data
        const channelId = /\d+/.exec(interaction.customId)[0];
        gameData = fetchGameFile(channelId);

        //build official chat confirmation embed
        const officialChatConfirmationEmbed = new EmbedBuilder()
            .setColor(0x777777)
            .setTitle("Deletion Rejected")
            .setDescription(`The deletion of ${gameData.gameName} has been rejected by ${interaction.user.tag}`);
        
        interaction.reply({embeds: [officialChatConfirmationEmbed]});
    }
}