const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { officerCheck, fetchGameFile } = require("../lib/common");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('setgametype')
        .setDescription('Manually set the type of the game associated with this channel.'),

    //the funciton to be run
    async execute(interaction) {
        if (!officerCheck(interaction.member)) {
            await interaction.reply({ content: "You are not authorized to use this command.", ephemeral: true });
            return;
        }

        const gameData = fetchGameFile(interaction.channel.id);
        if (!gameData) {
            await interaction.reply({ content: "This channel does not seem to be associated with a game. (File not found)", ephemeral: true });
            return;
        }

        const menuRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`gameSetType${gameData.channelId}`)
                .setPlaceholder("Nothing selected")
                .addOptions(
                    {
                        label: "Campaign",
                        value: "Campaign"
                    },
                    {
                        label: "Series",
                        value: "Series"
                    },
                    {
                        label: "Oneshot",
                        value: "Oneshot"
                    }
                )
        );

        await interaction.reply({content: "Select the game's new type.", components: [menuRow], ephemeral: true});
    }
}