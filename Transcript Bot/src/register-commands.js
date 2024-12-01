require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
  throw new Error('Missing variables. Check your .env file');
}

const commands = [
  {
    name: 'ticket-setup',
    description: 'Setup the ticket system',
  },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(`Successfully registered ${commands.length} slash commands.`);
  } catch (error) {
    console.error(`There was an error registering commands: ${error}`);
  }
})();
