const { REST, Routes } = require('discord.js');
const { clientid, productionGuildId, token } = require('./secrets.json');
const fs = require('node:fs');
const path = require('node:path');


const commands = [];
// Grab all the command files from the commands folder
//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandFiles = [];
getAllNestedFiles('./commands', commandFiles);

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./${file}`);
	console.log(`requiring ${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientid, productionGuildId), //to push to a single (testing) server
            //Routes.applicationCommands(clientId), //to push to all servers
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

function getAllNestedFiles(rootDirectory, fileList){
    fs.readdirSync(rootDirectory).forEach(File => {
        const filePath = path.join(rootDirectory, File);
        if(fs.statSync(filePath).isDirectory()){
            return getAllNestedFiles(filePath, fileList);
        }
        else{
            return fileList.push(filePath);
        }
    });
}