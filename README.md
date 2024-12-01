
# Discord Bot Transcript Setup Guide

## Prerequisites

If you don’t already have a bot created, follow this tutorial [here](https://youtu.be/KZ3tIGHU314?si=X7Dc89UBRuNl1Gkk) until the 3-minute mark to get started. 

> **Note:** Special thanks to UnderCtrl for his excellent videos. I got started with bot creation through his tutorials, and I highly recommend them if you want to learn more about Discord bot development.

## Setup Instructions

### 1. Install Dependencies

In your terminal, execute the following commands to install the necessary dependencies:

```bash
npm init -y
npm install discord.js axios dotenv
```

### 2. Configure Environment Variables

Create and open the `.env` file in your project folder. Add the following variables and their corresponding values:

- **TOKEN:** Your bot's token. You can get it from the [Discord Developer Portal](https://discord.com/developers/applications). Navigate to your bot application, go to the "Bot" section, and copy the token.
  
- **GUILD_ID:** The ID of your Discord server. To find this, enable Developer Mode in your Discord settings, right-click your server’s name, and select "Copy ID".
  
- **CLIENT_ID:** Your bot’s client ID. This can be found in the "General Information" section of your bot application in the [Discord Developer Portal](https://discord.com/developers/applications).
  
- **COOKIE:** An API key from [Cookie API](https://www.cookie-api.com/dashboard), required for generating transcripts. Log in using Discord to obtain this key.
  
- **TRANSCRIPTS_CHANNEL_LOG:** The ID of the channel where transcript logs should be sent. Right-click the desired channel in Discord (with Developer Mode enabled) and select "Copy ID".
  
- **STAFF_ROLE_ID:** The role ID of the staff. The users with this role will be able to see the tickets. Right-click the desired role in Discord (with Developer Mode enabled) and select "Copy ID".


It should look like this:

```bash
TOKEN = your-bot-token-here
GUILD_ID = your-guild-id-here
CLIENT_ID = your-client-id-here
COOKIE = your-cookie-api-key-here
TRANSCRIPTS_CHANNEL_LOG = your-channel-id-here
STAFF_ROLE_ID = your-staff-role-id-here
```

### 3. Set Up Your Bot

Run the following commands to set up and start your bot:

```bash
node src/register.commands.js   # Register your bot's commands
node src/index.js               # Start the bot
```

### 4. Enjoy!

Your bot should now be up and running. Enjoy your new ticket system!

# If you encounter any issues, you can contact me via discord. My tag is 'mrordenador'

