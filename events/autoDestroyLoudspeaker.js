const { Events } = require('discord.js');
const { client } = require('../index');
const { productionGuildId } = require('../secrets.json');

module.exports = {
    name: Events.VoiceStateUpdate,
    /**
     * This function will respond to people leaving VCs, seeing if there's a loudspeaker in there.
     * If there is nobody else in that channel, the loudspeaker will be destroyed. 
     * @param {*} oldState 
     * @param {*} newState 
     * @returns 
     */
    async execute(oldState, newState) {
        //oldState is a VoiceState object

        if (oldState.guild.id != productionGuildId || !oldState.channel)
            return;

        const channel = oldState.channel;
        const assignLoudspeakerResult = await client.functions.get("assignLoudspeaker").execute(channel.id, client.loudspeakers);

        //don't do anything if there's no loudspeaker in there or if there are still people other than the bot in there
        if (assignLoudspeakerResult.status != "already assigned" || channel.members.size != 1)
            return;

        const loudspeakerClient = client.loudspeakers.get(assignLoudspeakerResult.loudspeakerId);
        client.functions.get("destroyLoudspeaker").execute(loudspeakerClient);
    }
}