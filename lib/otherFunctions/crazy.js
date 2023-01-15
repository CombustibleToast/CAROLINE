
module.exports = {
    name: "crazy",
    trigger: "crazy",

    async execute(message){
        //read the blacklist file
        const fs = require('fs');
        let blacklistedUserList;
        try{
            blacklistedUserList = JSON.parse(fs.readFileSync(`${__dirname}/crazyBlacklist.json`));
        }
        catch(e){
            console.error(`Unable to crazy a user:\n${e}`)
            return;
        }

        //check if the user is blacklisted
        if(blacklistedUserList.users.includes(message.author.id))
            return;

        //reply
        try{
            message.reply("https://cdn.discordapp.com/attachments/439519668819066880/807339991889739837/image0-69.gif");
            message.channel.send("||Say \"no crazy\" to disable crazy||");
        }
        catch(e){
            console.error(`Couldn't :\n${e.stack}`)
        }
    }
}