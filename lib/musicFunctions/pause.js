
module.exports = {
	name: "pause",

	async execute(interaction) {
        if(!interaction.client.functions.get("checkLoudspeakerOccupancy.js")){
            return "There's no loudspeaker in your channel! Please use /join first."
        }

        
    }
}