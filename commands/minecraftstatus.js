const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const serverIp = "tosat.apexmc.co";
const url = `https://api.mcsrvstat.us/3/${serverIp}`;
const browserUrl = `https://mcsrvstat.us/server/${serverIp}`;
const trainmapUrl = `http://${serverIp}:9756`
const dynMapUrl = `http://${serverIp}:9045`

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('minecraftstatus')
        .setDescription('Check the status of the Minecraft server.'),

    //the funciton to be run
    async execute(interaction) {
        //const fetch = require('node-fetch');

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
                interaction.followUp(`API failure; the website didn't respond.\n${browserUrl}`);
                console.log(`mcsrvstat didn't respond:\n${e.stack}`);
            });
    }
}

function buildOfflineEmbed(data){
    const embed = new EmbedBuilder()
        .setColor("aa2211")
        .setTitle("Server is Currently Offline")
        .setDescription(`The server is currently offline.\nIt's either undergoing maintenence or there isn't interest.\n${browserUrl}`);
    return embed;
}

function buildOnlineEmbed(data){
    const playersOnlineStatus = data.players.online == 0 ? "Nobody is currently playing." : `Currently online: ${getPlayerNameList(data.players.list)}`;
    const webViewLink = `- [Status Webview](${browserUrl})`
    const dynMapNotice = `- [Live Map](${dynMapUrl})`
    const trainMapNotice = `- [Train Map](${trainmapUrl})`
    //const modsStatus = `Mods: ${data.mods ? "Yes" : "Nope"}`; //doesn't detect mods for some reason

    let description = `${playersOnlineStatus}\nJoin in at ${serverIp}\n${webViewLink}\n${dynMapNotice}\n${trainMapNotice}`;
    const embed = new EmbedBuilder()
        .setColor("22ee66")
        .setTitle("The Server is Online!")
        .setDescription(description);
    return embed;
}

function getPlayerNameList(objectList){
    const nameList = [];
    objectList.forEach(player => {
        nameList.push(player.name)
    });

    return nameList;
}