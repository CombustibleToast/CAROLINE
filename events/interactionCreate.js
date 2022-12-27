const { Events } = require('discord.js');
const forms = require('../lib/forms.js')

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
        //console.log(`Button customID: ${interaction.customId}, matches regex: ${/officerApproveGmFormSubmission\d+/.test(interaction.customId)}`);
        switch (/[a-zA-Z]+/.exec(interaction.customId)[0]) {
            case "gmFormButton":
                await forms.pushGmForm(interaction);
                break;
            case "reportFormButton":
                await forms.pushReportForm(interaction);
                break;
            case "officerApproveGmFormSubmission":
                console.log(`approving ${interaction.customId}`);
                await forms.handleGmFormAccept(interaction);
                break;
            /*this has become a modal
            case "officerDenyGmFormSubmission":
                console.log(`denying ${interaction.customId}`);
                await forms.handleGmFormDeny(interaction);
                break;*/
            case "officerConfirmGmFormDeny":
                console.log(`confirming ${interaction.customId}`);
                await forms.confirmGmFormDeny(interaction);
                break;
            default:
                console.log(`INVALID BUTTON ID ${interaction.customId}`);
                break;
        }
    }

    //handle form submissions
    if (interaction.isModalSubmit) {
        switch (/[a-zA-Z]+/.exec(interaction.customId)[0]) {
            case "gmFormSubmit":
                forms.handleGmFormSubmission(interaction);
                break;
            case "reportFormSubmit":
                forms.handleReportFormSubmission(interaction);
                break;
            case "officerDenyGmFormSubmission":
                console.log(`denying ${interaction.customId}`);
                await forms.handleGmFormDeny(interaction);
                break;
            default:
                console.log(`INVALID MODAL ID ${interaction.customId}`);
                break;
        }
    }
}