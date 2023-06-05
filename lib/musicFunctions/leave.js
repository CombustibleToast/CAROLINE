const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "leave",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //disconnect the loudspeaker
        await interaction.client.functions.get('destroyLoudspeaker').execute(loudspeakerClient);

        //respond to the user
        await interaction.followUp("Loudspeaker disconnected.");
    }
}