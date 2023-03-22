# CAROLINE - A Discord Bot Created for GMU's TTRPG Club
CAROLINE was created to streamline the creation and maintenance of members' self-owned games within the club's Discord server. Powered by Discord.js v14 and NodeJS.

# Info for Server Members

**If there is ever any issue with CAROLINE, please contact Ena. CombustibleToast#7274 on Discord.**

## Commands

- `/roll <query>` 
    
    This command rolls some dice! Supports usage of k/d and h/l for keeping/dropping and highest/lowest values, respectively. Ex: `/roll 1d20 + 3d6kh1`. This will roll one twenty-sided die and add the highest outcome of three six-sided dice to the total.

## Music

Coming soon...

## Reporting

Head to the `#roles-and-forms` channel to find the report form. Specify the user you are reporting and the reason you are reporting them. Your report will be sent to the officers immediately. **Your report is 100% anonymous.**

# Info for Game Masters

## Creating a New Game

To create a game, go to the #forms-and-roles channel and click on `GM Form`. You will be prompted to enter some information about your new game. As a note, please enter your desired role color as a **HEX VALUE**, otherwise your role will default to black.

Your request will be sent to the officers for review, and if approved, a channel will be created for you. The initial message will contain buttons to manage your game.

Once your new game is created, post any initial information you'd like to give your players before they join the game. This can be information about the system you're using, a small bit of lore about the world, and anything else applicable. See what other games have done for examples.

Once you're ready to open your the game to the club, click the `Open/Close Game` button in the initial message sent by CAROLINE.

## Managing Your Game

CAROLINE provides a few options for you to manage your game:
 - `Join/Leave Game`

    This command allows club members to join or leave your game. As a GM, this command has no effect on you.
 - `Open/Close Game`

    This command will cause your game's channel to toggle between private and unprivate. While private, only club members who have the role for your game will be able to view and send messages in the channel.
 - `Restrict/Free Joins`

    By default, games are in "restricted" mode, meaning anyone who tries to join will require you to confirm their entry. You will see a message saying someone requested to join. You will have the option to confirm or deny their request. If the game is in "free" mode, this confirmation message will not appear.
 - `Request Deletion`

    If you are done with your game, you may click this button to send a request to the officers. They will confirm with you on the deletion before completing the request. Do note that this action is irreversible and the game's channel will be permanently deleted. 

### Additional Commands for Game Management

- `/invite <user>`
    
    If you wish to send a message to another member inviting them to your game, you may use this command. They will receive a prompt to either accept or deny your invitation. Only you, the GM, may use this command and it must be used within the channel of a game that you are the GM of.

# Info for Players

To join a game, first confirm with the GM to ensure that they are willing to have you. 

Once confirmed, open the pinned messages of that channel and find the one by CAROLINE (usually at the bottom of the list). Jump to that message.
There you will find the controls for the game. Click "Join/Leave Game".

If the GM has restricted join mode enabled, they will be notified of your request, allowing them the option to approve or deny your request. If the game is in free join mode, you will automatically be given the role for the game, allowing you access to the channel once it is closed.
To leave a game, press the same button and your role will be removed.

# Info for Officers

If anything is unclear or missing please contact Ena.

## Game Creation

When a GM submits the GM form, #official-chat will be notified and list all of the information they inputted into the form. After looking over the information, you can either approve or deny the request. Denial requires a reason and a confirmation so that it is not done automatically.

GMs of new games can ping the club officer role to request a ping of the LFG channel. There isn't a rule for this but don't give channels multiple pings within a short amount of time. (In the future GMs will be notified that they can request this upon first opening their game. For now, ask them if they'd like one when they open their game.)

## Report Form

When someone submits a report form, #official-chat will be notified of it and include the username of the person being reported and the reason why. Note that these forms are anonymous.

## Game Management Buttons

Officers hold the power to use any of the buttons that Caroline posts in addition to the GM, with the exception of `Join/Leave Game` where officers are treated the same as any other server member.

## Additional Game Management Tools

- `/playerremoverole <user> <gameChannel>`

    This command can be used to forcibly remove a game role from a player. You *can* just remove it from the role menu in Discord, but this command also removes the user from the internal list CAROLINE keeps to track members of a game. **It is greatly preferred that you use the command over simply removing their role.**

- `/importgame <gameName> <gameGM> <gameRole> <isClosed> <type> <system>`

    Use this command if a GM wishes to have the controls CAROLINE provides but the game existed before the bot was implemented. Please make sure you type everything in correctly. There is currently no implementation of "unimporting" a game.

- `/setgametype <newType>`

    Use this command in the game's channel to change the type of game it is, e.g. from a Oneshot to a Campaign.

## Game Deletion

When a GM requests their game to be deleted, contact them first and ask for a reason. Then use that reason in the confirmation form that appears when you approve the request.

## Game Archival

Not yet implemented. Will allow for long-lasting games to be archived, preserving the channel and role but disallowing messages to be sent. It will also move it to a special archived games section.
