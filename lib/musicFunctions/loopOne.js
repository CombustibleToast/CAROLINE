const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "loopOne",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        loudspeakerClient.player.loopOne = !loudspeakerClient.player.loopOne; //i'm going to hope that !undefined becomes true

        await interaction.followUp(`Loop one turned ${loudspeakerClient.player.loopOne ? "on" : "off"}.`);
        return ;
    }
}