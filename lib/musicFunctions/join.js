
module.exports = {
    name: "join",

    async execute(interaction) {
        //this function does not use the latent loudspeaker check
        if (!interaction.replied)
            await interaction.deferReply({ ephemeral: true });

        let response = "";

        if (!interaction.member.voice.channel) {
            response = "You need to be in a voice channel to use music commands.";
            if (!interaction.replied)
                await interaction.followUp(response);
            return response;
        }

        //attempt to connect loudspeaker
        const result = await interaction.client.functions.get("connectLoudspeaker").execute(interaction);

        //respond to the user
        switch (result.status) {
            case "no vacancies":
                response = "Unfortunately there are no vacant loudspeakers at this time.";
                break;
            case "already assigned":
                response = "There is already a loudspeaker in your channel.";
                break;
            case "new assignment":
                response = "Assigned a loudspeaker to your channel."
                break;
        }

        if (!interaction.replied)
            await interaction.followUp(response);
        
        return response;
    }
}