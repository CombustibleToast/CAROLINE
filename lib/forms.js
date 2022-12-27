const { ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, EmbedBuilder, TextInputAssertions, TextInputBuilder, TextInputStyle, ModalBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits, Colors } = require("discord.js");
const { officialChatId, campaignCategoryId, seriesCategoryId, oneshotCategoryId, unsortedCategoryId, officerRoleId, everyoneId } = require('../secrets.json');

module.exports = {
    initGmAndReportForm,
    pushGmForm,
    pushReportForm,
    handleGmFormSubmission,
    handleReportFormSubmission,
    handleGmFormAccept,
    handleGmFormDeny,
    confirmGmFormDeny
};

async function initGmAndReportForm(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("Forms")
        .setDescription("GM Form: Fill out this form to open a game in the server.\n\nReport Form: Fill out this form to send an anonymous report about another user in the server.");

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("gmFormButton")
            .setLabel("GM Form")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId("reportFormButton")
            .setLabel("Report Form")
            .setStyle(ButtonStyle.Danger)
        );

    await interaction.channel.send({ embeds: [embed], components: [actionRow] });
}

async function handleGmFormSubmission(interaction) {
    await interaction.deferReply({ephemeral: true});

    //extract form data
    const formData = {
        userId: interaction.user.id,
        userTag: interaction.user.tag,
        gameName: interaction.fields.getTextInputValue('gmFormGameName'),
        gameType: interaction.fields.getTextInputValue('gmFormGameType'),
        gameSystem: interaction.fields.getTextInputValue('gmFormGameSystem'),
        gameDesiredColor: interaction.fields.getTextInputValue('gmFormRoleColor'),
        gameLocationAndDescription: interaction.fields.getTextInputValue('gmFormGameLocationAndDescription')
    };

    //build message container
    const embed = new EmbedBuilder()
        .setColor(0x0000FF)
        .setTitle("New Game Application")
        .setDescription(`
            **GM:** ${formData.userTag}\n
            **Name:** ${formData.gameName}\n
            **Type:** ${formData.gameType}\n
            **System:** ${formData.gameSystem}\n
            **Color:** ${formData.gameDesiredColor}\n
            **Location and Description:**\n${formData.gameLocationAndDescription}\n
            `);

    //action row for approve/deny buttons
    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`officerApproveGmFormSubmission${interaction.user.id}`)
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`officerConfirmGmFormDeny${interaction.user.id}`)
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        );
    
    //write the interaction to disk to save it for future approval/denial
    const fs = require('fs');
    fs.writeFileSync(`./data/gameApplications/gmFormRequestBy_${interaction.user.id}.json`, JSON.stringify(formData));

    //send message
    const client = require("../index.js").client;
    const channel = client.channels.cache.get(officialChatId);
    await channel.send({ embeds: [embed], components: [buttonRow] });
    await interaction.followUp({content: "Sent! The club officers have recieved your application and will review it shortly.", ephemeral: true});
}

async function handleGmFormAccept(interaction) {
    await interaction.deferReply();

    //attempt to open the stored campaign request file
    const fs = require('fs');
    let formData; 
    try{
        formData = JSON.parse(fs.readFileSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`));
    }
    catch(e){
        await interaction.followUp("Game application doesn't exist or couldn't be opened.");
        return;
    }

    //figure out whether the game is a campaign, oneshot, or series, and put in unsorted if undetermined
    const server = interaction.guild;
    let targetCategory;
    let targetCategoryIsUnsorted = false;
    const client = require("../index.js").client;
    switch(formData.gameType.toLowerCase().charAt(0)){
        case "c":
            targetCategory = client.channels.cache.get(campaignCategoryId);
            break;
        case "s":
            targetCategory = client.channels.cache.get(seriesCategoryId);
            break;
        case "o":
            targetCategory = client.channels.cache.get(oneshotCategoryId);
            break;
        default:
            targetCategory = client.channels.cache.get(unsortedCategoryId);
            targetCategoryIsUnsorted = true;
            break;
    }

    //create the game role
    //const desiredColor = isNaN(parseInt(formData.gameDesiredColor)) ? Colors.Default : parseInt(formData.gameDesiredColor); djs might auto set to default for invalid value
    const newRole = await server.roles.create({
        name: formData.gameName,
        color: parseInt(`0x${formData.gameDesiredColor}`),
        mentionable: true
    });

    //create the channel, add permissions, move to the target category
    const newChannel = await server.channels.create({
        name: formData.gameName, 
        reason: `GM application by ${formData.userTag} approved by ${interaction.user.tag}. Automatically performed by CAROLINE.`,
        type: ChannelType.GuildText
    });
    await newChannel.setParent(targetCategory); //Missing Access is a permissions problem, giving her admin fixes but but let's not do that
    newChannel.edit({
        permissionOverwrites: [
            { //make channel private by disallowing @everyone to view it
                id: everyoneId,
                deny: [PermissionFlagsBits.ViewChannel]
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
    ]});

    //compile preliminary message with the actions
    const newChannelCreatedEmbed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle(formData.gameName)
        .setDescription(`${formData.gameLocationAndDescription}\n\nGM: When you are ready to open the game to the club, click "Open/Close Game"\n\nPlayers: Click the "Join Game" to get the role for this game.`);
    const gameActionsRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`gameGetRole${newRole.id}`)
            .setLabel("Join Game")
            .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
            .setCustomId(`gameTogglePrivate${newChannel.id}_${formData.userId}`)
            .setLabel("Open/Close Game")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setCustomId(`gameDeletionRequest${newChannel.id}`)
            .setLabel("Delete Game")
            .setStyle(ButtonStyle.Danger)
        );
    
    //send and pin, then ping gm
    await newChannel.send({embeds: [newChannelCreatedEmbed], components: [gameActionsRow]})
        .then((message) => {message.pin()});
    await interaction.guild.members.fetch(formData.userId)
        .then(async (user) => await newChannel.send(user.toString()));
    
    //followup the reply in official chat
    const officialReplyEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle("Success");
    if(targetCategoryIsUnsorted)
        officialReplyEmbed.setDescription(`Application approved and channel successfully created. However, I couldn't find the right category to put it under, so it is unsorted.`);
    else
        officialReplyEmbed.setDescription(`Application approved and channel successfully created.`);
    await interaction.followUp({embeds: [officialReplyEmbed]})

    //delete the request form 
    try{
        //fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`); TODO: REMOVE // BEFORE PROD
    }
    catch{}

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
    fs.writeFileSync(`./data/existingGames/${gameData.gameName.replace(/[^a-z0-9]/gi, '_')}_${interaction.user.id}.json`, JSON.stringify(gameData));
}

async function confirmGmFormDeny(interaction) {
    //collect userid
    const userid = /\d+/.exec(interaction.customId)[0];

    //check if application exists
    const fs = require('fs');
    try{
        fs.existsSync(`./data/gameApplications/gmFormRequestBy_${userid}`);
    }
    catch(e){
        const nonExistantMessageEmbed = new EmbedBuilder()
            .setColor(0x999900)
            .setTitle("Application doesn't exist or was not found.");
        await interaction.readFileSync({embeds: [nonExistantMessageEmbed], ephemeral: true});
    }
    
    //build confirmation form
    const modal = new ModalBuilder()
        .setCustomId(`officerDenyGmFormSubmission${userid}`)
        .setTitle('Deny Game Application');

    //Row 1
    const reason = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmDenyReason')
        .setLabel("Reason for Denial")
        .setStyle(TextInputStyle.Paragraph);
    const row1 = new ActionRowBuilder().addComponents(reason);

    //Row 2
    const confirmation = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmDenyConfirmCheck')
        .setLabel("Type \"Confirm\"")
        .setStyle(TextInputStyle.Short);
    const row2 = new ActionRowBuilder().addComponents(confirmation);
    
    //push form
    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
}

async function handleGmFormDeny(interaction){
    //check to see if the deletion was confirmed
    if(interaction.fields.getTextInputValue('gmDenyConfirmCheck').toLowerCase() != "confirm"){
        await interaction.reply({content: "You failed to pass the confirmation. The application was not deleted.", ephemeral: true});
        return;
    }

    await interaction.deferReply();

    //collect userid and tag
    const userid = /\d+/.exec(interaction.customId)[0];
    const deniedUser = await interaction.guild.members.fetch(userid);
    console.log(`user: ${deniedUser.user.tag}`);

    //build embed
    let officialChatDenyConfirmationEmbed;
    try{
        officialChatDenyConfirmationEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${interaction.user.tag} has denied the application submitted by ${deniedUser.user.tag}`);
    }
    catch{
        officialChatDenyConfirmationEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${interaction.user.tag} has denied an application. The applying user could not be found.`);
    }
    
    //attempt to delete the file
    const reason = interaction.fields.getTextInputValue('gmDenyReason');
    const fs = require('fs');
    let success = true;
    try{
        //fs.unlinkSync(`./data/gameApplications/gmFormRequestBy_${/\d+/.exec(interaction.customId)[0]}.json`); TODO: REMOVE // BEFORE PROD
        officialChatDenyConfirmationEmbed.setDescription(`Reason: ${reason}\n\nFile deleted succesfully.`);
    }
    catch(e){
        officialChatDenyConfirmationEmbed.setDescription(`Reason: ${reason}\n\nFile could not be found so I guess it already didn't exist lol.`);
    }

    //post official chat embed
    await interaction.followUp({embeds: [officialChatDenyConfirmationEmbed]});

    //build embed for dming the user
    const deniedUserDMEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("Game Application Denied")
        .setDescription(`Your application to create a new game has been denied for the following reason:\n\n${reason}\n\nPlease contact an officer for more information.`);

    //attempt to DM the user
    try{
        deniedUser.send({embeds: [deniedUserDMEmbed]});
    }
    catch(e){
        interaction.channel.send(`${deniedUser} could not be DMed.\n${e}`);
    }
}

async function pushGmForm(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('gmFormSubmit')
        .setTitle('New Game Form');

    //Row 1
    const gameName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameName')
        .setLabel("Name of Game")
        .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(gameName);

    //Row 2
    const gameType = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameType')
        .setLabel("Type of Game (Campaign, One-Shot, or Series)")
        .setStyle(TextInputStyle.Short);
    const row2 = new ActionRowBuilder().addComponents(gameType);

    /*"Currently, you cannot use StringSelectMenuBuilders or ButtonBuilders in modal action rows builders." bruh
    const gameType = new StringSelectMenuBuilder()
        .setCustomId('gmFormGameTypeSelectionMenu')
        .setPlaceholder("Nothing Selected")
        .addOptions(
            {
                label: "Campaign",
                description: "Longform games that typically have many sessions throughout and between semesters.",
                value: "first_option"
            },
            {
                label: "Series",
                description: "A group of one-shots that may or may not be connected in story and/or characters.",
                value: "second_option"
            },
            {
                label: "One-Shot",
                description: "A single, one-off session of a game.",
                value: "third_option"
            }
        );
        const row2 = new ActionRowBuilder().addComponents(gameType);*/

    //Row 3
    const gameSystem = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormGameSystem')
        .setLabel("System (D&D 5e, Lancer, PbtA, etc.)")
        .setStyle(TextInputStyle.Short);
    const row3 = new ActionRowBuilder().addComponents(gameSystem);

    //Row 4
    const roleColor = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('gmFormRoleColor')
        .setLabel("Desired Role Color in Hex")
        .setStyle(TextInputStyle.Short);
    const row4 = new ActionRowBuilder().addComponents(roleColor);

    //Row 5
    const gameLocation = new TextInputBuilder()
    .setRequired(true)
    .setCustomId('gmFormGameLocationAndDescription')
    .setLabel("Game Location and Description")
    .setStyle(TextInputStyle.Paragraph);
    const row5 = new ActionRowBuilder().addComponents(gameLocation);

    modal.addComponents(row1, row2, row3, row4, row5);
    await interaction.showModal(modal);
}

async function handleReportFormSubmission(interaction) {
    await interaction.deferReply({ephemeral: true});
    const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("User Report")
        .setDescription(
            `**User:** ${interaction.fields.getTextInputValue('reportFormTargetUser')}\n
            **Reason:** ${interaction.fields.getTextInputValue('reportFormReason')}`);
    
    const client = require("../index.js").client;
    const channel = client.channels.cache.get("602596055711875083");
    await channel.send({embeds: [embed]});
    await interaction.followUp({content: "Your report has been sent to the officers.", ephemeral: true});
}

async function pushReportForm(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('reportFormSubmit')
        .setTitle('Report Form');

    //Row 1
    const targetUser = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('reportFormTargetUser')
        .setLabel("Who are you reporting? (E.g. Glanis#3784)")
        .setStyle(TextInputStyle.Short);
    const row1 = new ActionRowBuilder().addComponents(targetUser);

    //Row 2
    const complaint = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('reportFormReason')
        .setLabel("Why are you reporting them?")
        .setStyle(TextInputStyle.Paragraph);
    const row2 = new ActionRowBuilder().addComponents(complaint);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);
}