const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    //command definition for discord API
    data: new SlashCommandBuilder()
        .setName('minecraftstatus')
        .setDescription('Check whether tosat.ddns.net is online.'),

    //the funciton to be run
    async execute(interaction) {
        const fetch = require('node-fetch');

        await interaction.deferReply();

        let url = "https://api.mcsrvstat.us/2/tosat.ddns.net";
        let settings = { method: "Get" };
        await fetch(url, settings)
            .then(response => response.json())
            .then((json) => {
                console.log(json.software);
                let embed;
                if(json.online)
                    embed = buildOnlineEmbed(json);
                else
                    embed = buildOfflineEmbed(json);
                interaction.followUp({embeds: [embed]});
            })
            .catch(() => {
                interaction.followUp("API failure; the website didn't respond.")
            });
        
        //interaction.followUp("Recieved a reply.");
    }
}

function buildOfflineEmbed(data){
    const embed = new EmbedBuilder()
        .setColor("aa2211")
        .setTitle("Server is Currently Offline")
        .setDescription("The server is currently offline.\nIt's either undergoing maintenence or there isn't a world currently.");
    return embed;
}

function buildOnlineEmbed(data){
    const playersOnlineStatus = data.players.online = 0 ? "Nobody is currently playing." : `Currently online: ${data.players.list}`;
    //const modsStatus = `Mods: ${data.mods ? "Yes" : "Nope"}`; //doesn't detect mods for some reason

    let description = `${playersOnlineStatus}\nJoin in at tosat.ddns.net`;
    const embed = new EmbedBuilder()
        .setColor("22ee66")
        .setTitle("The Server is Online!")
        .setDescription(description);
    return embed;
}