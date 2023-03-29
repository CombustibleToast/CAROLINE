const { } = require('discord-player');

module.exports = {
    name: "play",
    async execute(interaction){
        /**
         * This function should:
         * Assign a new vacant loudspeaker to the user's channel if there isn't one already already assigned and have it join the channel.
         * If there is no queue, create a new one.
         * Parse whether the query is a video link, playlist link, or search term and enqueue the found video(s).
         * If there is no query, unpause the playback (call resume.js).
         */

        const loudspeakerAssignment = await interaction.client.functions.get("assignLoudspeaker").execute(interaction);

        if(loudspeakerAssignment.status == "no vacancies"){
            await interaction.reply({content: "There are no vacant loudspeakers at the moment.", ephemeral: true});
            return;
        }

        //collect the channel's loudspeaker
        const loudspeaker = interaction.client.loudspeakers.get(loudspeakerAssignment.loudspeakerId);

        //if a new loudspeaker was assigned
        if(loudspeakerAssignment.status == "ok"){
            await interaction.reply({content: "Assigning a new loudspeaker to your voice channel.", ephemeral: true});
            //loudspeaker.voice.
        }
            
    }
}