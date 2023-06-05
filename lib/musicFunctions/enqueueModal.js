const { ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder } = require("discord.js");

module.exports = {
    name: "enqueueModal",
    async execute(interaction) {
        //custom latent check
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }
        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;
        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            await interaction.reply({ content: "There is no loudspeaker in your channel! Please use /join first.", ephemeral: true });
            return;
        }
        
        //user passed latent check
        //init modal
        const modal = new ModalBuilder()
            .setCustomId('enqueue')
            .setTitle('Enqueue a Song, Playlist, or Search Term');
    
        //input row
        const query = new TextInputBuilder()
            .setRequired(true)
            .setCustomId('query')
            .setLabel("Video URL, Playlist URL, or Search")
            .setStyle(TextInputStyle.Short);
        const row1 = new ActionRowBuilder().addComponents(query);
    
        modal.addComponents(row1);
        await interaction.showModal(modal);
    }
}