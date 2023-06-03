const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "enqueue",

    /**
     * This function enqueues a query using an interaction's option.getString('query').
     * It WILL reply to the user with an ephemeral response and also return the response.
     * Be sure to use interaction.editReply() in the function that called this.
     * @param {*} interaction 
     * @returns 
     */
    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        let response = "";

        //if there's no query, don't do anything
        if (!interaction.options.getString('query')) {
            response = "No query provided. Did not enqueue anything.";
            if (!interaction.replied && !interaction.deferred)
                await interaction.followUp(response);
            return response;
        }

        //start a response to the user
        response = "Pondering your query...";
        if (interaction.replied || interaction.deferred)
            await interaction.editReply(response);
        else
            await interaction.followUp(response);

        //enqueue query
        const query = interaction.options.getString('query');
        const videosAdded = await interaction.client.functions.get("enqueueQuery").execute(query, loudspeakerClient);

        //respond with all of the video titles enqueued
        response = "";
        if (videosAdded.length == 1)
            response += `Added [${videosAdded[0].title}](<${videosAdded[0].url}>)`; //<> to remove embed

        else {
            response += "Added the following tracks:\n"
            let numVideosListed = 0;
            for (let video of videosAdded) {
                response += `[${video.title}](<${video.url}>)\n`;
                numVideosListed++;
                //check if character limit is being approached
                if (response.length >= 1600) {
                    response += `...and ${videosAdded.length - numVideosListed} more tracks.`
                    break;
                }
            }
        }

        await interaction.editReply(response);
        return response;
    }
}