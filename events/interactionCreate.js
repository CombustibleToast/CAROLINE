const { Events } = require('discord.js');
const initforms = require('../commands/initforms.js');
require('../commands/buttoncommands.js');
require('../commands/forms.js')

//on interaction...
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        await handleSpecialCases(interaction);

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

async function handleSpecialCases(interaction) {
    //handle button commands
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case "gmFormButton":
                await pushGmForm();
                break;
            case "reportFormButton":
                await pushReportForm();
                break;
            default:
                console.log(`INVALID BUTTON ID ${interaction.customId}`);
                break;
        }
    }

    //handle form submissions
    if (interaction.isModalSubmit) {
        switch (interaction.customId) {
            case "gmFormSubmit":
                handleGmForm(interaction);
                break;
            case "reportFormSubmit":
                handleReportForm(interaction);
                break;
        }
    }

    //listening to me :)
    if (interaction.message && interaction.message.author.id == 122065561428426755) {
        switch (interaction.message.content) {
            case "initForms":
                initGmAndReportForm(interaction); //forms.js
                break;
        }
    }
}