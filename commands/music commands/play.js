const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a Youtube video or playlist given a URL or search query.")
        .addStringOption(option => 
            option
                .setName("query")
                .setDescription("Enter a Youtube video or playlist URL, or enter a search query.")
                .setRequired(false)
        ),

        async execute(interaction){
            /*
            if(!interaction.member.voice.channel){
                await interaction.reply({content: "You need to be in a voice channel to use music commands.", ephemeral: true});
                return;
            }*/
            
            interaction.client.functions.get("play").execute(interaction);
        }
}