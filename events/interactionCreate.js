const { Events, DMChannel } = require('discord.js');
const { cooldownTime, productionGuildId } = require('../secrets.json');

//on interaction...
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        //check if this iteration of the bot services this guild but allow all DMs
        if(interaction.guild != null && interaction.guild.id != productionGuildId){
            console.log(`Received a request from another guild ${interaction.guild.id}`);
            return;
        }
        
        //check if the user is on cooldown
        const cooldowns = interaction.client.cooldowns;
        const userId = interaction.user.id;
        if(cooldowns.has(userId) && userId != "122065561428426755"){
            //user is on cooldown, reply to them as such and don't do anything else.
            console.log(`User is con cooldown: ${interaction.user.tag}`);
            interaction.reply({content: `Please wait ${cooldownTime} seconds between requests.`, ephemeral: true});
            return;
        }
        else if(userId != "122065561428426755"){
            //user is not on cooldown, don't stop them.
            cooldowns.set(userId, interaction);
            console.log(`Added ${userId} to cooldowns.`);
            setTimeout(() => {
                cooldowns.delete(userId);
                console.log(`Removed ${userId} from cooldowns.`);
            }, cooldownTime * 3000);
        }

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
            console.error(`[WARN] Error processing function ${funcName}:\n${e}`);
            try{
                if(!interaction.replied && !interaction.deferred)
                    await interaction.reply({content: "There was an error processing your request.", ephemeral: true});
                else
                    await interaction.followUp({content: "There was an error processing your request.", ephemeral: true});
            }
            catch(e){
                console.log(`[INFO] Unable to reply to user after function failure:\n${e}`);
            }
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