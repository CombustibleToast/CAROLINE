//system paths
const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./secrets.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//commands collection
client.commands = new Collection();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);