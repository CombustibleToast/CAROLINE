
module.exports = {
    name: "nocrazy",
    trigger: "no crazy",

    async execute(message){
        //read the blacklist file
        const fs = require('fs');
        let blacklistedUserList;
        try{
            blacklistedUserList = JSON.parse(fs.readFileSync(`${__dirname}/crazyBlacklist.json`));
        }
        catch(e){
            console.error(`Unable to open file for a no crazy user:\n${e}`)
            return;
        }

        //check if the user is already blacklisted
        if(!blacklistedUserList.users.includes(message.author.id)){
            blacklistedUserList.users.push(message.author.id);
            fs.writeFileSync(`${__dirname}/crazyBlacklist.json`, JSON.stringify(blacklistedUserList));
        }

        //respond with reaction
        message.react('👍');
    }
}