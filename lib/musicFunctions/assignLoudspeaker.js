
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

        //TODO: have the bot join the channel https://discordjs.guide/voice/voice-connections.html#cheat-sheet
        //join the channel
        const channel = interaction.member.voice.channel;
        const { joinVoiceChannel } = require('@discordjs/voice');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        //TODO: implement a server-wide check that disconnects bots from empty VCs every 5 mins, prob put this in index.js
        return { status: "ok", loudspeakerId: vacantLoudspeakerClient.user.id};
    }
}