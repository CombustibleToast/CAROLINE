const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { officerCheck, fetchGameFile } = require('../lib/common.js');
const internal = require("stream");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gameinfo')
        .setDescription("Queries a game for info.")
        .addChannelOption(option =>
            option.setName('gamechannel')
                .setRequired(true)
                .setDescription("The channel of the game in question.")
        ),

    async execute(interaction) {
        //only officers may use this command
        if (!officerCheck(interaction.member)) {
            await interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        //collect game id
        const gameId = interaction.options.getChannel('gamechannel').id;

        //get game data
        const gameData = fetchGameFile(gameId);

        //check if the game exists/is imported
        if (!gameData) {
            await interaction.reply({ content: "The channel specified isn't a game or hasn't been imported by Caroline.", ephemeral: true })
            return;
        }

        await interaction.deferReply();

        let gmString = interaction.guild.members.cache.get(gameData.gmId) ? interaction.guild.members.cache.get(gameData.gmId) : await interaction.guild.members.fetch(gameData.gmId)
            .catch(reason =>{
                console.log(`[WARN] Coudld not fetch GM in gameinfo.js:\n${reason}`)
                return gmId;
            });

        //compile data
        const data = `
        Game Name: ${gameData.gameName}\n
        Type: ${gameData.gameType}\n
        System: ${gameData.gameSystem}\n
        Channel: ${interaction.guild.channels.cache.get(gameData.channelId)}\n
        Role: ${interaction.guild.roles.cache.get(gameData.roleId)}\n
        Status: ${gameData.status}\n
        Joinability: ${gameData.joinability}\n
        GM: ${gmString}\n
        Players: ${await getPlayerList(interaction, gameData)}\n
        `

        //build embed
        const embed = new EmbedBuilder()
            .setColor(`DarkGreen`)
            .setTitle(`Info on ${gameData.gameName}`)
            .setDescription(data)

        //send
        await interaction.followUp({ embeds: [embed] })
    }
}

async function getPlayerList(interaction, gameData){
    let playerList = "";
    for(playerId of gameData.participants){
            //playerobject not found, try fetching it instead of the cache
        let playerObject = interaction.guild.members.cache.get(playerId) ? interaction.guild.members.cache.get(playerId) : await interaction.guild.members.fetch(playerId);
        
        if(playerObject)
            playerList += `${playerObject}, `
        else
            playerList += `${playerId}, `
    }
    return playerList
}