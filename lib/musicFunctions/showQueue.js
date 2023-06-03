
module.exports = {
    name: "showQueue",

    async execute(interaction) {
        //collect vc id for loudspeaker assignment test
        const channelId = interaction.member.voice.channelId;

        //don't do anything if there's no loudspeaker assigned
        const loudspeakerAssignmentResult = await interaction.client.functions.get("assignLoudspeaker").execute(channelId, interaction.client.loudspeakers);
        if (loudspeakerAssignmentResult.status != "already assigned") {
            return "There is no loudspeaker in your channel! Please use /join first.";
        }

        //collect queue
        const queue = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId).queue;

        //special response if the queue is empty
        if(queue.length == 0)
            return "The queue is empty.";

        //compile items in the queue starting at 0 if a starting point is not given
        //we can't show all of them at once because it may exceed the character limit.
        const response = `Queue for your channel:\n${queueToString(queue, 0)}`;
        return response;
    }
}

function queueToString(queue, startingIndex) {
    let response = "";
    for (let i = startingIndex; i < queue.length; i++) {
        if (response.length >= 1900) {
            //off by one if this happens after adding the new item
            response += `..and ${queue.length - i} more tracks.`
            break;
        }
        response += queue[i].title + "\n";
    }
    return response;
}