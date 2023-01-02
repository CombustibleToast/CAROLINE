const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { officerCheck } = require('../lib/common.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('importgame')
        .setDescription("Imports a game not automatically created by CAROLINE. !!ONLY USE THIS COMMAND IN GAME CHANNELS!!")
        .addStringOption(option =>
            option.setName('gamename')
                .setRequired(true)
                .setDescription("The name of the game (make sure you spell it correctly).")
        )
        .addUserOption(option =>
            option.setName('gm')
                .setRequired(true)
                .setDescription("The gm of the game.")
        )
        .addRoleOption(option =>
            option.setName('role')
                .setRequired(true)
                .setDescription("The role associated with the game.")
        )
        .addBooleanOption(option =>
            option.setName('isclosed')
                .setRequired(true)
                .setDescription("If the game is closed, select true.")
        )
        .addStringOption(option =>
            option.setName('type')
                .setRequired(true)
                .setDescription("Campaign, Series, or One-Shot")
        )
        .addStringOption(option =>
            option.setName('system')
                .setRequired(true)
                .setDescription("The system of the game (D&D 5e, Lancer, etc.).")
        ),

    async execute(interaction) {
        //only officers may use this command
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        //compile list of existing participants
        //doing role.members will have only one member with the role, posted to stackoverflow
        //https://stackoverflow.com/questions/74978493/role-members-only-contains-a-single-value-when-there-are-multiple 
        /*
        const existingParticipants = [];
        await interaction.guild.roles.fetch(interaction.options.getRole('role').id, { force: true })
            .then(role => role.members
                .forEach(member => existingParticipants.push(member.id)))
        console.log(`Import compiled a list of all role-having members: ${existingParticipants}`);

        return;*/

        //create a new gamedata object
        const gameData = {
            created: Date.now(),
            imported: true,
            gmId: interaction.options.getUser('gm').id,
            //participants: [interaction.options.getUser('gm').id],
            participants: existingParticipants,
            status: interaction.options.getBoolean('isclosed') ? "closed" : "open",
            joinability: "restricted",
            roleId: interaction.options.getRole('role').id,
            channelId: interaction.channel.id,
            gameName: interaction.options.getString('gamename'),
            gameType: interaction.options.getString('type'),
            gameSystem: interaction.options.getString('system'),
            applicationForm: null
        }
        console.log("Import built gameData object.");

        //check if a game for this channel already exists
        const fs = require('fs');
        if (fs.existsSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`)) {
            interaction.followUp(`An existing game file was found for this game. Please contact Ena if you believe this is an issue.`);
            return;
        }
        console.log("Import did not find a preexisting file for the game.");

        //give caroline permission to view the channel
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.client.user, { 'ViewChannel': true })
        }
        catch (e) {
            interaction.followUp("Failed. Please edit the channel permissions to allow CAROLINE to view the channel.");
            return;
        }
        console.log("Import gave CAROLINE permission to view the channel.");

        //create the initial message
        const embed = new EmbedBuilder()
            .setColor(interaction.options.getRole('role').color)
            .setTitle(gameData.gameName)
            .setDescription(`
                Imported pre-existing game.\n
                **GM:** If you would like to open/close your game to the public, click open/close game.\n
                **Players:** Click the "Join/Leave Game" to get/remove the role for this game.`);
        const gameActionsRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gameJoinReq${gameData.channelId}`)
                    .setLabel("Join/Leave Game")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`gameTogglePrivate${gameData.channelId}`)
                    .setLabel("Open/Close Game")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`gameToggleJoinable${gameData.channelId}`)
                    .setLabel("Restrict/Free Joins")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`gameDeletionRequest${gameData.channelId}`)
                    .setLabel("Delete Game")
                    .setStyle(ButtonStyle.Danger)
            );
        console.log("Import built initial message");

        //write the file
        fs.writeFileSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`, JSON.stringify(gameData));
        console.log(`Import wrote the file to ./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${gameData.channelId}.json`);

        //send the message to the channel
        await interaction.channel.send({ embeds: [embed], components: [gameActionsRow] })
            .then(message => message.pin());
        console.log("Import sent the initial message");

        interaction.followUp("Done.");
    }
}