const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { categoryIds, sortingRoleIds, officerRoleId, clientid, gmRoleId } = require('../../secrets.json');
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
        let sortingRole;
        let officerEmbedDescriptionString = "";
        const client = require("../../index.js").client;
        switch (formData.gameType.toLowerCase().charAt(0)) {
            case "c":
                targetCategory = client.channels.cache.get(categoryIds.campaign);
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.campaign);
                officerEmbedDescriptionString += "Parsed to be a campaign.\n";
                break;
            case "s":
                targetCategory = client.channels.cache.get(categoryIds.series);
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.series);
                officerEmbedDescriptionString += "Parsed to be a series.\n";
                break;
            case "o":
                targetCategory = client.channels.cache.get(categoryIds.oneshot);
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.oneshot);
                officerEmbedDescriptionString += "Parsed to be a one-shot.\n";
                break;
            default:
                targetCategory = client.channels.cache.get(categoryIds.unsorted);
                sortingRole = interaction.guild.roles.cache.get(sortingRoleIds.unsorted);
                officerEmbedDescriptionString = "Could not determine game type. Please ask the GM and use the /setgametype command.\n";
                break;
        }

        //create the game role
        //const desiredColor = isNaN(parseInt(formData.gameDesiredColor)) ? Colors.Default : parseInt(formData.gameDesiredColor); djs might auto set to default for invalid value
        const newRole = await server.roles.create({
            name: formData.gameName,
            color: parseInt(`0x${formData.gameDesiredColor}`), //somehow this works for "rrr, ggg, bbb" too?
            mentionable: true,
            hoist: true
        })
            .then(officerEmbedDescriptionString += "Role created successfully.\n");
        console.log(`newRole: ${newRole}`);
        await newRole.setPosition(sortingRole.position) //+1 puts it 2 above the sorting role, -1 puts it directly below the sorting role
            .then(officerEmbedDescriptionString += "Role sorted successfully.\n")
            .catch(e => {
                console.error(`[WARN] Unable to sort the new role for ${formData.gameName}:\n${e}`);
                officerEmbedDescriptionString += "Could not sort the role properly. Please move it.\n"
            }); 

        //give the GM the new role and the GM role
        await interaction.guild.members.fetch(formData.userId)
            .then(member => {
                member.roles.add(newRole)
                member.roles.add(interaction.guild.roles.cache.get(gmRoleId));
                officerEmbedDescriptionString += "Gave the user the GM role.\n";
            })
            .catch(e => {
                officerEmbedDescriptionString += "Was unable to give the user the GM role.\n";
                console.error(`Error while giving a gm a role in gmformaccept:\n${e.stack}`)
            });

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
        })
            .then(officerEmbedDescriptionString += "Channel created.\n")
            .catch(e => {
                console.log(`Unable to create a new channel after accepting a GM form:\n${e}`);
                officerEmbedDescriptionString("Unable to create a new channel! (Woe is you if you see this message)\n")
            });
        await newChannel.setParent(targetCategory, { lockPermissions: false });

        //compile preliminary message with the actions
        let colorInt = parseInt(`0x${formData.gameDesiredColor}`);
        if (isNaN(colorInt)) {
            colorInt = parseInt("0x666666"); //there's probably a better way to do this
        }

        const newChannelCreatedEmbed = new EmbedBuilder()
            .setColor(colorInt)
            .setTitle(formData.gameName)
            .setDescription(`
                **Game Location and Description:** ${formData.gameLocationAndDescription}\n
                **Game System:** ${formData.gameSystem}\n
                **GM:** Post any information you would like the players to have here. When you are ready to open the game to the club, click "Open/Close Game." 
                When you have enough players and would like to private/close the game, click "Open/Close Game." 
                If you would like an LFG ping, please notify an officer.\n
                **Players:** Click the "Join Game" to get the role for this game with the GM's approval.`);
        const gameActionsRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gameJoinReq${newChannel.id}`)
                    .setLabel("Join/Leave Game")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`gameTogglePrivate${newChannel.id}`)
                    .setLabel("Open/Close Game")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`gameToggleJoinable${newChannel.id}`)
                    .setLabel("Restrict/Free Joins")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`gameDeletionRequest${newChannel.id}`)
                    .setLabel("Delete Game")
                    .setStyle(ButtonStyle.Danger)
            );

        //send and pin and ping gm
        await newChannel.send({content: interaction.guild.members.cache.get(formData.userId).toString(), embeds: [newChannelCreatedEmbed], components: [gameActionsRow] })
            .then((message) => { message.pin() });
        //await interaction.guild.members.fetch(formData.userId)
            //.then(async (user) => await newChannel.send(user.toString()));

        //followup the reply in official chat
        const officialReplyEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(`Application Approved for ${newChannel.toString()}`)
            .setDescription(`${officerEmbedDescriptionString}\nApproved by ${interaction.user}\nPlease add this game to the game master list here: https://docs.google.com/spreadsheets/d/1W5x3P5Yq2UYVY--NewjhjlrkHIrSBQGX-ZLtlyJGg-c/edit?usp=sharing`);
        await interaction.followUp({ embeds: [officialReplyEmbed] })

        //edit the official chat message to remove the buttons
        await interaction.message.edit({components: []});

        //delete the request form 
        try {
            fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`);
        }
        catch(e){
            console.log(`[WARN] Unable to delete ./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json\n${e}`);
        }

        //create an new game file
        const gameData = {
            created: Date.now(),
            imported: false,
            gmId: formData.userId,
            participants: [formData.userId],
            status: "closed",
            joinability: "restricted",
            previouslyOpened: false,
            roleId: newRole.id,
            channelId: newChannel.id,
            gameName: formData.gameName,
            gameType: formData.gameType,
            gameSystem: formData.gameSystem,
            applicationForm: formData
        }

        //write the file
        fs.writeFileSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${newChannel.id}.json`, JSON.stringify(gameData));

        //it's moving out of place for some reason so try parenting it again
        console.log(`parenting new channel to ${targetCategory}`);
        await newChannel.setParent(targetCategory, { lockPermissions: false });
    }
}