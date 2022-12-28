const { Events } = require('discord.js');

//on interaction...
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        //handle slash commands
        if (interaction.isChatInputCommand()) {
            //console.log(interaction);

            //store the command
            const command = interaction.client.commands.get(interaction.commandName);
            console.log(`${interaction.user.tag} is performing command ${interaction.commandName}`);
            
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
                if(!interaction.replied && !interaction.deferred)
                    await interaction.reply({ content: 'There was an error while executing your command.', ephemeral: true });
                else
                    await interaction.followUp({ content: 'There was an error while executing your command.', ephemeral: true });
            }
            return;
        }
        
        //handle functions
        const funcName = /[a-zA-Z]+/.exec(interaction.customId)[0];
        console.log(`${interaction.user.tag} is performing function ${funcName}`);

        //get the associated function
        const func = interaction.client.functions.get(funcName);

        //do nothing if the function doesn't exist
        if(!func){
            console.error(`No function with the name ${funcName}`);
            return;
        }

        //try executing the function
        try {
            await func.execute(interaction);
        }
        catch (e) {
            console.error(`Error processing function ${funcName}:`);
            console.error(e);
            if(!interaction.replied && !interaction.deferred)
                await interaction.reply({content: "There was an error processing your request.", ephemeral: true});
            else
                await interaction.followUp({content: "There was an error processing your request.", ephemeral: true});
        }
    }
}

/*
async function handleFunctions(interaction) {
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
                break;/
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
}*/