const latentFunctionPrecheck = require("./latentFunctionPrecheck");

module.exports = {
    name: "loop",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect loudspeaker
        const loudspeakerClient = guardCheckResponse.loudspeakerClient;

        //if an option is given, set it to that
        //ternary is for compatibilitiy with button controls; they won't have int.options
        let choice = interaction.options ? interaction.options.getBoolean('on') : undefined;
        if (choice) {
            //special message if loop was already set to that value
            if (choice == loudspeakerClient.player.loop) {
                await interaction.followUp(`Loop was already ${choice ? "on" : "off"}.`);
                return;
            }
            loudspeakerClient.player.loop = choice;
        }
        //otherwise, toggle the loop
        else
            loudspeakerClient.player.loop = !loudspeakerClient.player.loop; //i'm going to hope that !undefined becomes true

        await interaction.followUp(`Loop turned ${loudspeakerClient.player.loop ? "on" : "off"}.`);
        return ;
    }
}