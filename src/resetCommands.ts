import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';
import { clientId, guildId } from '../config.json';

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

if (guildId) {
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    .then(() => console.log('[√] Successfully deleted all guild commands.'))
    .catch(console.error);
}

rest.put(Routes.applicationCommands(clientId), { body: [] })
  .then(() => console.log('[√] Successfully deleted all application commands.'))
  .catch(console.error);