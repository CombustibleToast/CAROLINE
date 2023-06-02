
module.exports = {
    name: "clearQueue",

    /**
     * Removes every song from the queue of the assigned loudspeaker except the one that's currently playing.
     * If the interaction boolean option says to, it will also remove the first song by skipping it.
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {
        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;

        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            return "There is no loudspeaker in your channel! Please use /join first.";
        }

        //collect loudspeaker
        const loudspeakerClient = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId);

        //collect command option
        const clearCurrentlyPlayingSong = interaction.options.getBoolean('clearcurrentlyplaying');

        //do nothing if the queue is empty
        if(loudspeakerClient.queue.length == 0)
            return "The queue is already empty."

        //do nothing if the queue only has one song and they don't want to clear it
        if(loudspeakerClient.queue.length == 1 && clearCurrentlyPlayingSong)
            return "There's only one song playing and you didn't want to clear it."

        if(clearCurrentlyPlayingSong){
            //weird but it works: https://stackoverflow.com/a/1232046
            loudspeakerClient.queue.length = 0;
            interaction.client.functions.get("skip").execute(interaction);
        }
        else{ //don't clear current song
            const temp = loudspeakerClient.queue[0];
            loudspeakerClient.queue.length = 0;
            loudspeakerClient.queue.push(temp);
        }
    }
}