const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle } = require("discord.js");
const { fetchGameFile } = require("../common.js");
const gameGetRole = require("./gameGetRole.js");

module.exports = {
    name: "gameJoinReq",

    async execute(interaction) {
        //interaction user is the one who is requesting to join
        //if the channel/game is in freejoin, do gameGetRole
        //if the channel/game is in restricted, push a dm to the GM asking whether they want the player in

        const channelId = /\d+/.exec(interaction.customId)[0];
        const gameData = fetchGameFile(channelId);
        if (!gameData) {
            interaction.reply(`Unable to get game data for ${channelId}. Please contact Ena or another officer if you believe this is an issue.`);
            return;
        }

        //give them the role if it's in free join
        //if they're already a participant, the function will remove them from the role as well.
        if (gameData.joinability == "free" || gameData.participants.includes(interaction.user.id)) {
            gameGetRole.execute(interaction);
            return;
        }

        //Don't allow the GM to use this
        if (gameData.gmId == interaction.user.id) {
            interaction.reply({ content: "You are the GM of this game!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        //build embed and options
        const embed = new EmbedBuilder()
            .setTitle("New Join Request")
            .setDescription(`${interaction.user.toString()} would like to join ${gameData.gameName}.\n
                You have the option to approve or deny this request because your game is set to restricted join.`)
            .setColor(0x44ffaa);
        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`gameJoinAccept${channelId}_${interaction.user.id}`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`gameJoinDeny${channelId}_${interaction.user.id}`)
                .setLabel("Reject")
                .setStyle(ButtonStyle.Danger)
        );

        /* TODO: Figure out why messages in DMs can't be edited (in gameJoinAccept/Deny.js) then you can uncomment this code
                For now the message is just sent in the game's channel.
        //attempt to dm the GM
        const gm = interaction.guild.members.cache.get(gameData.gmId);
        console.log(`gmid: ${gameData.gmId}\ngm:${gm}`);
        try {
            await gm.send({ embeds: [embed], components: [buttonRow] });
        }
        catch (e) {
            console.log(`[INFO] Couldn't DM ${gm}:\n${e.stack}`);
            await interaction.channel.send({ content: `I couldn't message the GM so I'm sending this here.`, embeds: [embed], components: [buttonRow] });
        }*/

        
        //send application message to the channel
        const gm = await interaction.guild.members.fetch(gameData.gmId);
        await interaction.guild.channels.cache.get(gameData.channelId)
            .send({
                content: `${gm.toString()}\n||In the future this will be sent as a direct message but the feature is currently broken.||`,
                embeds: [embed],
                components: [buttonRow]});

        //reply to the clicker
        interaction.followUp(`${gameData.gameName} is in restricted join mode, so your request to join has been sent to the GM.`);
    }
}