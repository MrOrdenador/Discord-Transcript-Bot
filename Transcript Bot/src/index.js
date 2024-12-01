require('dotenv').config();
const { Client, IntentsBitField, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

require('./src/commands/ticket-setup')(client);

client.on('ready', () => {
  console.log(`${client.user.tag} is online`);
  client.user.setActivity({
    name: 'By MrOrdenador',
    type: ActivityType.Watching,
  });
});

client.login(process.env.TOKEN);
