
module.exports = {
    name: "assignLoudspeaker",
    async execute(interaction) {
        /**
         * This function should:
         * Find out whether the user's vc needs a loudspeaker assigned to it. Return {status: "already assigned", loudspeakerid: loudspeakerid}
         * If it does, search the client.loudspeakers collection and find one that is unassigned.
         * If there are no vacancies, return {status: "no vacancies"}
         * Return {status: "ok", loudspeakerid}
         */

        const voiceChannelId = interaction.member.voice.channelId;

        //search for both a vacant loudspeaker and a loudspeaker that is already occupying the user's vc
        let vacantLoudspeakerClient;
        let channelHasLoudspeakerAlready = false;
        interaction.client.loudspeakers.each(loudspeakerClient => {
            if (!loudspeakerClient.channelOccupancy)
                vacantLoudspeakerClient = loudspeakerClient;
            else if (loudspeakerClient.channelOccupancy == voiceChannelId) {
                channelHasLoudspeakerAlready = true;
                vacantLoudspeakerClient = loudspeakerClient;
                return;
            }
        });

        if (channelHasLoudspeakerAlready)
            return { status: "already assigned", loudspeakerId: vacantLoudspeakerClient.user.id };

        if (!vacantLoudspeakerClient)
            return { status: "no vacancies" };

        //have the bot join the channel https://discordjs.guide/voice/voice-connections.html#cheat-sheet
        //IMPORTANT! The client that instantiates the Guild object when
        //creating the voice adapter will be the one who joins the channel!
        //https://discord.com/channels/222078108977594368/1090014703209693194/1090123144594980934
        const channel = await loudspeakerClient.channels.fetch(interaction.member.voice.channel.id);
        const { joinVoiceChannel } = require('@discordjs/voice');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        //TODO: implement a server-wide check that disconnects bots from empty VCs every 5 mins, prob called from index.js
        return { status: "ok", loudspeakerId: vacantLoudspeakerClient.user.id};
    }
}