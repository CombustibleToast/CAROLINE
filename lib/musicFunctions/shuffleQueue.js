const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "shuffleQueue",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //do nothing if there is nothing to shuffle
        //not shuffling the first item, so there needs to be at least 3 items
        if (loudspeakerClient.queue.length <= 2) {
            let response = "There are too few songs in the queue to shuffle.";
            await interaction.followUp(response);
            return response;
        }

        //shuffle all items except the first
        //using this algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        const queue = loudspeakerClient.queue;
        //save and remove the first item
        const firstItem = queue.shift();
        //perform shuffle
        for (let i = queue.length - 1; i >= 0; i--) {
            const rand = Math.floor(Math.random() * i);
            const temp = queue[i];
            queue[i] = queue[rand];
            queue[rand] = temp;
        }
        //replace first item
        queue.unshift(firstItem);

        let response = "Queue shuffled.";
        await interaction.followUp(response);
        return response;
    }
}