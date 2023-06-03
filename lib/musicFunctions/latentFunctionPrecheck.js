
module.exports = {
    /**
     * This function WILL DEFER OR REPLY TO THE INTERACTION!
     * 
     * This function should:
     * Check if the user is in a VC
     *  If not, return {inVoiceChannel: false}
     * Check if a loudspeaker is in the channel
     *  If not, return {inVoiceChannel: true, channelId: <channelId>, loudspeakerClient: null}
     * return {inVoiceChannel: true, channelId: <id>, loudspeakerClient: <Client>}
     * @param {*} interaaction 
     * @returns 
     */
    async execute(interaction){
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return {inVoiceChannel: false};
        }

        await interaction.deferReply({ephemeral: true});

        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;

        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            await interaction.reply({ content: "There is no loudspeaker in your channel! Please use /join first.", ephemeral: true });
            return {inVoiceChannel: true, channelId: channelId, loudspeakerClient: null};
        }

        //collect loudspeaker
        const loudspeakerClient = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId);
        return {inVoiceChannel: true, channelId, loudspeakerClient};
    }
}