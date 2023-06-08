const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a Youtube video or playlist given a URL or search query.")
        .addStringOption(option =>
            option
                .setName("query")
                .setDescription("Enter a Youtube video or playlist URL, or enter a search query.")
                .setRequired(false)
        ),

    /**
    * This function should:
    * Assign a new vacant loudspeaker to the user's channel if there isn't one already already assigned and have it join the channel.
    * If there is no queue, create a new one.
    * Parse whether the query is a video link, playlist link, or search term and enqueue the found video(s).
    * If there is no query, unpause the playback (call resume.js).
    * If there is a query and the queue was previously empty, start playback.
    */
    async execute(interaction) {
        if (!interaction.member.voice.channel) {
            await interaction.reply({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        const result = await interaction.client.functions.get("connectLoudspeaker").execute(interaction);
        let response = "";
        //respond to the user
        switch (result.status) {
            case "no vacancies":
                response = "Unfortunately there are no vacant loudspeakers at this time.\n";
                break;
            case "already assigned":
                response = "";
                break;
            case "new assignment":
                response = "Assigned a loudspeaker to your channel.\n"
                break;
        }

        response += await interaction.client.functions.get("enqueue").execute(interaction) + "\n";

        //TODO: resume/start playback
        response += await interaction.client.functions.get("resumePlayback").execute(interaction);

        await interaction.editReply(response);
    }
}