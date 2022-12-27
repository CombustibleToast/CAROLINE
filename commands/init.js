const { SlashCommandBuilder } = require("discord.js");
const forms = require("../lib/forms.js");

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

        console.log(forms);

        await forms.initGmAndReportForm(interaction);
        interaction.reply({content:"Done", ephemeral:"true"})
    }
}