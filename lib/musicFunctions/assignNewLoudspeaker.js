
module.exports = {
    name: "assignNewLoudspeaker.js",
    async execute(interaction){
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
            if(!loudspeakerClient.channelOccupancy)
                vacantLoudspeakerClient = loudspeakerClient;
            else if(loudspeakerClient.channelOccupancy == voiceChannelId){
                channelHasLoudspeakerAlready = true;
                vacantLoudspeakerClient = loudspeakerClient;
                return; 
            }
        });

        if(channelHasLoudspeakerAlready)
            return {status: "already assigned", loudspeakerId: vacantLoudspeakerClient.user.id};

        if(!vacantLoudspeakerClient)
            return {status: "no vacancies"};
        
        return {status: "ok", loudspeakerId: vacantLoudspeakerClient.user.id};

    }
}