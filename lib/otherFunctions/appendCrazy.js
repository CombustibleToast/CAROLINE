
module.exports = {
    name: "appendcrazy",
    trigger: "yes crazy",

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

        //check if the user is already not blacklisted
        if(blacklistedUserList.users.includes(message.author.id)){
            //append user to list
            blacklistedUserList.users.splice(blacklistedUserList.users.indexOf(message.author.id),1);
            fs.writeFileSync(`${__dirname}/crazyBlacklist.json`, JSON.stringify(blacklistedUserList));
        }

        //respond with reaction
        try{
            message.react('👍');
        }
        catch(e){
            console.error(`Couldn't react to someone:\n${e.stack}`)
        }
    }
}