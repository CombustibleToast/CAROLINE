const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies to the user'),
        
    //the funciton to be run
    async execute(interaction){
        await interaction.reply(`Hello ${interaction.user.username}`);
    }
}