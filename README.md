#It is broken whoops

# Discord-Chess-Bot
Discord Bot using [Discordie](https://github.com/qeled/discordie) that can run chess in Discord servers

## Setup

1. Script setup
  - In "script.js" at line 46, replace "INSERT TOKEN HERE" with the token for your Bot user. 
  - The Bot user token should be found in the application page for your specific bot.
    ![ss2](https://raw.githubusercontent.com/lordidiot/Discord-Chess-Bot/master/stuff/token.png)
    
2. Running the script
  - Ensure that [Node.js](https://nodejs.org/en/) is present in your computer.
  - Then run "run.bat", a command prompt window should pop-up and look something like this
    ![ss2](https://github.com/lordidiot/Discord-Chess-Bot/blob/master/stuff/startup.PNG)
    
3. Test the bot
  - In the Discord server where the bot was added, type "PING" into a text channel, and the bot should reply "PONG" in that same channel
  
    ![ss2](https://raw.githubusercontent.com/lordidiot/Discord-Chess-Bot/master/stuff/pingpong.PNG)
  - If the bot replies properly, the set up is finished!


## Usage

| Command | Description
|---------|-------------|
| `!chess start` | Sets Player 1 for a new Chess Game |
| `!chess join` | Joins the Chess Game, should only be done after `!chess start` has been used |
| `move <startpos><endpos>` | e.g. `move g2g4` to move a White Pawn |
