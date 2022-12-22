const { Events } = require('discord.js');

//on interaction...
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction){
		//only handle slash commands
		if (!interaction.isChatInputCommand()) return;
		//console.log(interaction);

		//store the command
		const command = interaction.client.commands.get(interaction.commandName);

		//do nothing if the command doesn't exist
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		//try executing the command
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}