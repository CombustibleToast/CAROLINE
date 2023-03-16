const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('minecraftstatus')
        .setDescription('Check the status of the Minecraft server.'),

    //the funciton to be run
    async execute(interaction) {
        const fetch = require('node-fetch');

        await interaction.deferReply();

        //let url = "https://api.mcsrvstat.us/2/tosat.apexmc.co";https:/api.mcsrvstat.us/debug/query/<address>
        let url = "https:/api.mcsrvstat.us/debug/ping/<address>";
        let settings = { method: "Get" };
        const fs = require('fs');
        await fetch(url, settings)
        /*
            .then(async (response) => {
                const str = await response.text();
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
                interaction.followUp("API failure; the website didn't respond.\nhttps://mcsrvstat.us/server/tosat.apexmc.co");
                console.log(`mcsrvstat didn't respond:\n${e.stack}`);
            });
        
        //interaction.followUp("Recieved a reply.");
    }
}

function buildOfflineEmbed(data){
    const embed = new EmbedBuilder()
        .setColor("aa2211")
        .setTitle("Server is Currently Offline")
        .setDescription("The server is currently offline.\nIt's either undergoing maintenence or there isn't interest.\nhttps://mcsrvstat.us/server/tosat.apexmc.co");
    return embed;
}

function buildOnlineEmbed(data){
    const playersOnlineStatus = data.players.online == 0 ? "Nobody is currently playing." : `Currently online: ${data.players.list}`;
    //const modsStatus = `Mods: ${data.mods ? "Yes" : "Nope"}`; //doesn't detect mods for some reason

    let description = `${playersOnlineStatus}\nJoin in at tosat.apexmc.co\nhttps://mcsrvstat.us/server/tosat.apexmc.co`;
    const embed = new EmbedBuilder()
        .setColor("22ee66")
        .setTitle("The Server is Online!")
        .setDescription(description);
    return embed;
}

function sleep(ms){

}