const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// for guild-based commands
if (guildId) {
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
		.then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);
}

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);