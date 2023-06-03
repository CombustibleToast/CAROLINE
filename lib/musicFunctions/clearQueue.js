const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "clearQueue",

    /**
     * Removes every song from the queue of the assigned loudspeaker except the one that's currently playing.
     * If the interaction boolean option says to, it will also remove the first song by skipping it.
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        console.log(`Guard: ${guardCheckResponse.inVoiceChannel}, ${guardCheckResponse.channelId}, ${guardCheckResponse.loudspeakerClient}`);
        if (!guardCheckResponse.inVoiceChannel && !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //collect command option to skip current song
        const clearCurrentlyPlayingSong = interaction.options.getBoolean('clearcurrentlyplaying');

        //do nothing if the queue is empty
        if (loudspeakerClient.queue.length == 0) {
            await interaction.followUp("The queue is already empty.");
            return;
        }

        //do nothing if the queue only has one song and they don't want to clear it
        if (loudspeakerClient.queue.length == 1 && !clearCurrentlyPlayingSong){
            await interaction.followUp("There's only one song in the queue and it was not cleared.\nTry using /skip.");
            return;
        }

        let skipResponse;
        if (clearCurrentlyPlayingSong) {
            //weird but it works: https://stackoverflow.com/a/1232046
            loudspeakerClient.queue.length = 1;
            skipResponse = await interaction.client.functions.get("skip").execute(interaction);
        }
        else { //don't clear current song
            const temp = loudspeakerClient.queue[0];
            loudspeakerClient.queue.length = 0;
            loudspeakerClient.queue.push(temp);
        }

        await interaction.followUp(`Queue was cleared.\n${skipResponse}`);
        return;
    }
}