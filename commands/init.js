const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('what could this be?'),

    //the funciton to be run
    async execute(interaction){
        if(interaction.user.id != '122065561428426755'){
            await interaction.reply({content: "Permission Denied", ephemeral: true});
            return;
        }

        await initGmAndReportForm(interaction);
        interaction.reply({content:"Done", ephemeral:"true"})
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