
module.exports = {
    name: "shuffleQueue",

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

        //do nothing if there is nothing to shuffle
        //not shuffling the first item, so there needs to be at least 3 items
        if(loudspeakerClient.queue.length <= 2){
            return "There are too few songs in the queue to shuffle.";
        }

        //shuffle all items except the first
        //using this algorithm: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        const queue = loudspeakerClient.queue;
        //save and remove the first item
        const firstItem = queue.shift();
        //perform shuffle
        for(let i = queue.length-1; i <= 0; i--){
            const rand = (int)(Math.random() * i);
            const temp = queue[i];
            queue[i] = queue[rand];
            queue[rand] = temp;
        }
        //replace first item
        queue.unshift(firstItem);
    }
}