const latentFunctionPrecheck = require("./latentFunctionPrecheck");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "showQueue",

    async execute(interaction) {
        const guardCheckResponse = await latentFunctionPrecheck.execute(interaction);
        if (!guardCheckResponse.inVoiceChannel || !guardCheckResponse.loudspeakerClient)
            return;

        //collect queue
        const queue = guardCheckResponse.loudspeakerClient.queue;

        //special response if the queue is empty
        if (queue.length == 0) {
            await interaction.followUp("The queue is empty.");
            return;
        }

        //collect starting point if there is one
        const startingIndex = /\d+/.exec(interaction.customId) ? /\d+/.exec(interaction.customId) : 0;

        //collect result of tostring and compile response
        const result = queueToString(queue, startingIndex);
        const response = `Queue for your channel:\n${result.text}`;

        //show a button if there are still more to show
        let buttonRow;
        if(result.lastIndex < queue.length - 1)
            buttonRow = buildButtonRow(result.lastIndex);

        await interaction.followUp({content: response, components: buttonRow ? [buttonRow] : []});
        return response;
    }
}

function queueToString(queue, startingIndex) {
    //compile items in the queue starting at 0 if a starting point is not given
    //we can't show all of them at once because it may exceed the character limit.
    let text = "";
    let i;
    for (i = startingIndex; i < queue.length; i++) {
        if (text.length >= 1800) {
            //off by one if this happens after adding the new item
            text += `..and ${queue.length - i} more tracks.`
            break;
        }
        text += `${i}. [${queue[i].title}](<${queue[i].url}>)\n`;
    }
    return { text: text, lastIndex: i };
}

function buildButtonRow(lastIndex){
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`${lastIndex}_showQueue`)
                .setLabel("Show More")
                .setStyle(ButtonStyle.Primary)
        );

    return row;
}