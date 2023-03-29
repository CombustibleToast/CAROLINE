//system paths
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, loudspeakerTokens } = require('./secrets.json');

// Create a new client instance for CAROLINE
const client = new Client({ intents: [GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.DirectMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates] });

// Log in to Discord with your client's token
client.login(token);
module.exports = {client};

//create instances for loudspeakers
const loudspeakerClients = loginLoudspeakerClients();

//commands collection
client.commands = new Collection();

//load all commands and add them to the collection
const commandsPath = path.join(__dirname, 'commands');
//read all files in the commands folder and return an array
//const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commandFiles = [];
getAllNestedFiles(commandsPath, commandFiles);
//put commands in the collection
for (const file of commandFiles) {
    //const filePath = file;
    //const filePath = path.join(commandsPath, file);
    const command = require(file);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

//same as above but for events
//https://discordjs.guide/creating-your-bot/event-handling.html#reading-event-files
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

//same as above but for custom functions
client.functions = new Collection();
const functionsPath = path.join(__dirname, 'lib');
//const functionFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));
const functionFiles = [];
getAllNestedFiles(functionsPath, functionFiles);
console.log(functionFiles);
for(const file of functionFiles){
    //const filePath = path.join(functionsPath, file);
    //console.log(`including ${file}`);
    const customFunction = require(file);
    if('name' in customFunction && 'execute' in customFunction)
        client.functions.set(customFunction.name, customFunction);
    else
        console.log(`The custom function ${file} is missing a name or executable.`);
}

//initialize cooldown collection for rate limiting, the rest is handled in interactioncreate.js
client.cooldowns = new Collection();

//compile the collection of loudspeaker clients
loudspeakerClients.then((loudspeakerClients) => {
    client.loudspeakers = new Collection();
    for(const loudspeaker of loudspeakerClients){
        client.loudspeakers.set(loudspeaker.id, loudspeaker);
    }
    console.log(`${loudspeakerClients.length} Loudspeakers ready`);
},
(error) => console.error(`Error while logging in loudspeakers:\n${error.stack}`));

//functions below

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

async function loginLoudspeakerClients(){
    return new Promise(async (resolve) => {
        const loudspeakerClients = [];
        for(const token of loudspeakerTokens){
            const loudspeakerClient = new Client({intents: GatewayIntentBits.Guilds});
            try{
                await loudspeakerClient.login(token);
                console.log(`Logged in loudspeaker ${loudspeakerClient.user.tag}`);
                loudspeakerClients.push(loudspeakerClient);
            }
            catch(e){
                console.error(`Couldn't login a loudspeaker:\n${e.stack}`);
            }
        }
        console.log("returning out of login function");
        resolve(loudspeakerClients);
    });
}