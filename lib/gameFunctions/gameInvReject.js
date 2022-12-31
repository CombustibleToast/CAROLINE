module.exports = {
    name: 'gameInvReject',
    async execute(interaction) {
        interaction.deferReply();

        //edit the invitation to remove the buttons
        const confirmEmbed = new EmbedBuilder()
            .setTitle(`Rejected Invitation`)
            .setDescription(`You have rejected the invitation to join ${gameData.gameName}.`)
            .setColor(0xff2233);
        try {
            await interaction.message.edit({ embeds: [confirmEmbed] }); //await shouldn't be needed
        }
        catch (e) {
            console.log(`[WARN] Unable to followup a DM to ${interaction.user.tag} accepting a player:\n${e}`);
            interaction.followUp({embeds: [confirmEmbed]});
        }
    }
}