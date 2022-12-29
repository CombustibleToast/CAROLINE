const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { categoryIds, sortingRoleIds, officerRoleId, clientid } = require('../../secrets.json');
const { officerCheck } = require('../common.js');

module.exports = {
    name: "gmFormAccept",
    async execute(interaction) {
        if (!officerCheck(interaction.member)) {
            interaction.reply({ content: "You are not authorized to perform this action.", ephemeral: true });
            return;
        }

        await interaction.deferReply();

        //attempt to open the stored campaign request file
        const fs = require('fs');
        let formData;
        try {
            formData = JSON.parse(fs.readFileSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`));
        }
        catch (e) {
            await interaction.followUp("Game application doesn't exist or couldn't be opened.");
            return;
        }

        //figure out whether the game is a campaign, oneshot, or series, and put in unsorted if undetermined
        const server = interaction.guild;
        let targetCategory;
        let sortedDescriptionString = " and properly sorted.";
        const client = require("../../index.js").client;
        switch (formData.gameType.toLowerCase().charAt(0)) {
            case "c":
                targetCategory = client.channels.cache.get(categoryIds.campaign);
                break;
            case "s":
                targetCategory = client.channels.cache.get(categoryIds.series);
                break;
            case "o":
                targetCategory = client.channels.cache.get(categoryIds.oneshot);
                break;
            default:
                targetCategory = client.channels.cache.get(categoryIds.unsorted);
                sortedDescriptionString = " but could not be sorted.\nOnce confirmed with the GM, use /setgametype in the game's channel.";
                break;
        }

        //create the game role
        //const desiredColor = isNaN(parseInt(formData.gameDesiredColor)) ? Colors.Default : parseInt(formData.gameDesiredColor); djs might auto set to default for invalid value
        const newRole = await server.roles.create({
            name: formData.gameName,
            color: parseInt(`0x${formData.gameDesiredColor}`),
            mentionable: true
        });

        //move the role to the right spot
        let sortingRole;
        switch (formData.gameType.toLowerCase().charAt(0)) {
            case "c":
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.campaign);
                break;
            case "s":
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.series);
                break;
            case "o":
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.oneshot);
                break;
            default:
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.unsorted);
                break;
        }
        console.log(`Newrole current pos: ${newRole.position}\nSortingrolepos: ${sortingRole.position}`);
        await newRole.setPosition(sortingRole.position) //+1 puts it 2 above the sorting role, -1 puts it directly below the sorting role
            .catch(e => console.error(`[WARN] Unable to sort the new role for ${formData.gameName}`)); 
        console.log(`Newrole after pos: ${newRole.position}\nsorting role pos after: ${sortingRole.position}`);

        //give the GM the role
        await interaction.guild.members.fetch(formData.userId)
            .then(member => member.roles.add(newRole));

        //create the channel, add permissions, move to the target category
        const newChannel = await server.channels.create({
            name: formData.gameName,
            reason: `GM application by ${formData.userTag} approved by ${interaction.user.tag}. Automatically performed by CAROLINE.`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { //make channel private by disallowing @everyone to view it
                    id: interaction.guild.id, //interaction.guild.id == @everyone.id
                    //id: everyoneId,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                { //allow caroline to view the channel
                    id: clientid,
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                { //allow officers to view the channel
                    id: officerRoleId,
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                { //allow the GM to view the channel and manage messages for pinning
                    id: formData.userId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageMessages]
                },
                { //allow the members of the game to view the channel
                    id: newRole.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                }
            ]
        });
        await newChannel.setParent(targetCategory, { lockPermissions: false }); //Missing Access is a permissions problem, giving her admin fixes but but let's not do that

        //compile preliminary message with the actions
        let colorInt = parseInt(`0x${formData.gameDesiredColor}`);
        if (isNaN(colorInt)) {
            colorInt = parseInt("0x666666"); //there's probably a better way to do this
        }

        const newChannelCreatedEmbed = new EmbedBuilder()
            .setColor(colorInt)
            .setTitle(formData.gameName)
            .setDescription(`${formData.gameLocationAndDescription}\n\n
                GM: Post any information you would like the players to have here. When you are ready to open the game to the club, click "Open/Close Game"\n
                When you have enough players and would like to private/close the game, click "Open/Close Game"\n\n
                Players: Click the "Join Game" to get the role for this game with the GM's approval.`);
        const gameActionsRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gameGetRole${newChannel.id}`)
                    .setLabel("Join Game")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`gameTogglePrivate${newChannel.id}`) //for this and delete button, use the stored game data to check if the clicking user is the gm
                    .setLabel("Open/Close Game")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`gameDeletionRequest${newChannel.id}`)
                    .setLabel("Delete Game")
                    .setStyle(ButtonStyle.Danger)
            );

        //send and pin and ping gm
        await newChannel.send({ embeds: [newChannelCreatedEmbed], components: [gameActionsRow] })
            .then((message) => { message.pin() });
        await interaction.guild.members.fetch(formData.userId)
            .then(async (user) => await newChannel.send(user.toString()));

        //followup the reply in official chat
        const officialReplyEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("Success")
            .setDescription(`Application approved, channel successfully created ${sortedDescriptionString}\n
                Approved by ${interaction.user.tag}`);
        await interaction.followUp({ embeds: [officialReplyEmbed] })

        //delete the request form 
        try {
            fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`);
        }
        catch { }

        //create an new game file
        const gameData = {
            created: Date.now(),
            gmId: formData.userId,
            participants: [formData.userId],
            status: "closed",
            roleId: newRole.id,
            channelId: newChannel.id,
            gameName: formData.gameName,
            gameType: formData.gameType,
            gameSystem: formData.gameSystem,
            applicationForm: formData
        }

        //write the file
        fs.writeFileSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${newChannel.id}.json`, JSON.stringify(gameData));
    }
}