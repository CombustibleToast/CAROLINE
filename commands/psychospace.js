const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const url = 'https://psychospace.info/'

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('psychospace')
        .setDescription('Find a page on psychospace.info')
        .addStringOption(option =>
            option
                .setName("page")
                .setDescription("The name of the page you want to link. (Case insensitive)")),

    //the funciton to be run
    async execute(interaction) {
        //const fetch = require('node-fetch');

        await interaction.deferReply();

        let page = interaction.options.getString("page");
        if(!page){
            interaction.followUp(`# <${url}home>`);
            return;
        }

        page = replaceSpacesWithPlusses(page);
        page = fixIOSApostrophe(page);

        interaction.followUp(`# <${url}${page}>`);
    }
}

function replaceSpacesWithPlusses(str){
    return str.replace(/\s/g, "+");
}

function fixIOSApostrophe(str){
    str = str.replace(/’/g, "'");
    str = str.replace(/‘/g, "'");
    return str;
}