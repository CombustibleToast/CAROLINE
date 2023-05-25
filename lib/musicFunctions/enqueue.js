
module.exports = {
	name: "enqueue",

	async execute(interaction) {
        //connect a loudspeaker if there isn't one
        const loudspeakerAssignmentResult = await interaction.client.functions.get("connectLoudspeaker").execute(interaction);
        if (loudspeakerAssignmentResult.status == "no vacancies") {
			await interaction.reply({ content: "Unfortunately there are no vacant loudspeakers at this time.", ephemeral: true });
			return;
		}
        
        //start a response to the user
        let response = "";

        //When there is a new loudspeaker assigned show a special message. Don't need one if there's already one assined
		if (loudspeakerAssignmentResult.status == "new assignment")
			response = "Assigning a new loudspeaker to your voice channel.\n\n";

        //send temporary response
        await interaction.reply({content: `${response}Pondering your query...`, ephemeral: true});
        
        //collect client and query and enqueue it
        const loudspeakerClient = interaction.client.loudspeakers.get(loudspeakerAssignmentResult.loudspeakerId);
        const query = interaction.options.getString('query');
        const videosAdded = await interaction.client.functions.get("enqueueQuery").execute(query, loudspeakerClient);

        //respond with all of the video titles enqueued
        if (videosAdded.length == 1)
            response += `Added [${videosAdded[0].title}](<${videosAdded[0].url}>)`; //<> to remove embed
        else {
            response += "Added the following videos:\n"
            for (let video of videosAdded)
                response += `[${video.title}](<${video.url}>)\n`;
        }

        await interaction.editReply(response);
        return response;
    }
}