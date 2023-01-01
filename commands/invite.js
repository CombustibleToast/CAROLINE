const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { fetchGameFile, officerCheck } = require("../lib/common.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Invite another person from this server into your game.")
        .addUserOption(option =>
            option.setName('recipient')
                .setDescription("The recipient of this invitation.")
                .setRequired(true)),

    async execute(interaction) {
        //defer ephemeral before error reply because someone will probably try to use this in general lol
        await interaction.deferReply({ ephemeral: true });

        //get game data
        const channelId = interaction.channel.id;
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.followUp(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        //check if user is the gm, deny if not (also allow officers to do this)
        if (interaction.user.id != gameData.gmId && !officerCheck(interaction.member)) {
            interaction.followUp("Only the GM may use this command.");
            return;
        }

        //collect target member
        const targetMember = interaction.options.getMember('recipient');

        //check if the target is the gm, deny if so
        if(gameData.gmId == targetMember.id){
            interaction.followUp("You are the GM of this game!");
            return;
        }

        //check if the target is already in the game, deny if so
        if (gameData.participants.indexOf(targetMember.id) != -1){
            interaction.followUp(`${targetMember.user.tag} is already a player!`);
            return;
        }

        //build invite embed and buttons
        const inviteEmbed = new EmbedBuilder()
            .setTitle(`Invitation to join ${gameData.gameName}`)
            .setDescription(`The GM of ${gameData.gameName} has invited you to join their game!`)
            .setColor(0x33ee22);
        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`gameInvAccept${gameData.channelId}`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`gameInvReject${gameData.channelId}`)
                .setLabel("Reject")
                .setStyle(ButtonStyle.Danger)
        );

        //push invite to user
        try {
            await targetMember.send({ embeds: [inviteEmbed], components: [buttonRow] });
        }
        catch (e) {
            console.log(`[INFO] Unable to DM user an invitation:\n${e}`);
            interaction.followUp("Unable to send the invitation to their DMs, please contact an officer.");
            return;
        }

        //reply with confirmation
        interaction.followUp("Sent! The user has received the invitation.");
    }
}