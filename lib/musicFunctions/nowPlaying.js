const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "nowPlaying",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect queue
        const queue = guardCheckResponse.loudspeakerClient.queue;

        //respond with the first song and its link
        await interaction.followUp(`Now playing: [${queue[0].title}](<${queue[0].url}>)`);
    }
}