const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('what could this be?')
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("gaming")),

    //the funciton to be run
    async execute(interaction) {
        if (interaction.user.id != '122065561428426755') {
            await interaction.reply({ content: "Permission Denied", ephemeral: true });
            return;
        }

        const choice = interaction.options.getString("type");
        switch (choice) {
            case "music":
                await initMusicButtons(interaction);
                break;
            default:
                await initGmAndReportForm(interaction);
                break;
        }
        await interaction.reply({ content: "Done", ephemeral: "true" })
    }
}

async function initGmAndReportForm(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0xFFFFFF)
        .setTitle("Forms")
        .setDescription("GM Form: Fill out this form to open a game in the server.\n\nReport Form: Fill out this form to send an anonymous report about another user in the server.");

    const actionRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("pushGmForm")
                .setLabel("GM Form")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("pushReportForm")
                .setLabel("Report Form")
                .setStyle(ButtonStyle.Danger)
        );

    await interaction.channel.send({ embeds: [embed], components: [actionRow] });
}

async function initMusicButtons(interaction) {
    //row 1
    //join(green), leave(red), 

    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("join")
                .setEmoji('📻')
                .setLabel("Join")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("leave")
                .setEmoji('👋')
                .setLabel("Leave")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("squelch")
                .setEmoji('🔕')
                .setLabel("Disable Replies")
                .setStyle(ButtonStyle.Secondary)
        );

    //row 2
    //enqueue(modal??), clear, queue, nowplaying
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("enqueueModal")
                //.setEmoji('')
                .setLabel("Add Song")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("clearQueue")
                //.setEmoji('')
                .setLabel("Clear Queue")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("showQueue")
                //.setEmoji('')
                .setLabel("Show Queue")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("nowPlaying")
                //.setEmoji('')
                .setLabel("Now Playing")
                .setStyle(ButtonStyle.Secondary)
        );

    //row 3
    //loop, loopOne, shuffle
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("loop")
                .setEmoji('🔁')
                //.setLabel("")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("loopOne")
                .setEmoji('🔂')
                //.setLabel("")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("shuffleQueue")
                .setEmoji('🔀')
                //.setLabel("")
                .setStyle(ButtonStyle.Secondary)
        );

    //row 4
    //resume, pause, skip,
    const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("resumePlayback")
                .setEmoji('▶️')
                //.setLabel("")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("pause")
                .setEmoji('⏸️')
                //.setLabel("")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("skip")
                .setEmoji('⏭️')
                //.setLabel("")
                .setStyle(ButtonStyle.Secondary),
        );

    //send rows as messages
    const channel = interaction.channel;
    await channel.send({ components: [row1] });
    await channel.send({ components: [row2] });
    await channel.send({ components: [row3] });
    await channel.send({ components: [row4] });
}