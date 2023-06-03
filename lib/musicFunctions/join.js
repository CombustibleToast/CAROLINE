
module.exports = {
    name: "join",

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.member.voice.channel) {
            await interaction.followUp({ content: "You need to be in a voice channel to use music commands.", ephemeral: true });
            return;
        }

        //attempt to connect loudspeaker
        const result = await interaction.client.functions.get("connectLoudspeaker").execute(interaction);

        //respond to the user
        let response;
        switch(result.status){
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

        await interaction.followUp(response);
    }
}