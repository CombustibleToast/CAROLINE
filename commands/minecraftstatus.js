const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const serverIp = "tosat.apexmc.co";
let url = `https://api.mcsrvstat.us/2/${serverIp}`;

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('minecraftstatus')
        .setDescription('Check the status of the Minecraft server.'),

    //the funciton to be run
    async execute(interaction) {
        const fetch = require('node-fetch');

        await interaction.deferReply();

        let settings = { method: "Get" };
        await fetch(url, settings)
        /*
            .then(async (response) => {
                const str = await response.text();
                const fs = require('fs');
                fs.writeFileSync(`./log.txt`, str);
                console.log(`logged`);
            })*/
            .then(response => response.json())
            .then((json) => {
                let embed;
                if(json.online)
                    embed = buildOnlineEmbed(json);
                else
                    embed = buildOfflineEmbed(json);
                interaction.followUp({embeds: [embed]});
            })
            .catch((e) => {
                interaction.followUp(`API failure; the website didn't respond.\n${url}`);
                console.log(`mcsrvstat didn't respond:\n${e.stack}`);
            });
    }
}

function buildOfflineEmbed(data){
    const embed = new EmbedBuilder()
        .setColor("aa2211")
        .setTitle("Server is Currently Offline")
        .setDescription(`The server is currently offline.\nIt's either undergoing maintenence or there isn't interest.\n${url}`);
    return embed;
}

function buildOnlineEmbed(data){
    const playersOnlineStatus = data.players.online == 0 ? "Nobody is currently playing." : `Currently online: ${data.players.list}`;
    //const modsStatus = `Mods: ${data.mods ? "Yes" : "Nope"}`; //doesn't detect mods for some reason

    let description = `${playersOnlineStatus}\nJoin in at ${serverIp}\n${url}`;
    const embed = new EmbedBuilder()
        .setColor("22ee66")
        .setTitle("The Server is Online!")
        .setDescription(description);
    return embed;
}

function sleep(ms){

}