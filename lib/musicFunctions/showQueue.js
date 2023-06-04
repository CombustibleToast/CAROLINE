const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "showQueue",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect queue
        const queue = guardCheckResponse.loudspeakerClient.queue;

        //special response if the queue is empty
        if(queue.length == 0){
            await interaction.followUp("The queue is empty.");
            return;
        }

        //compile items in the queue starting at 0 if a starting point is not given
        //we can't show all of them at once because it may exceed the character limit.
        const response = `Queue for your channel:\n${queueToString(queue, 0)}`;
        await interaction.followUp(response);
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