const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "pause",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //do nothing if it's already paused or idle
        switch (loudspeakerClient.player.state.status) {
            case "paused":
            case "autopaused":
                await interaction.followUp("Already paused.");
                break;
            case "idle":
                await interaction.followUp("Nothing is playing.");
                break;
            default:
                loudspeakerClient.player.pause();
                await interaction.followUp("Playback paused.");
                break;
        }
    }
}