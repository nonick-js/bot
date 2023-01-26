import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import { AllowedMentionsTypes, Client, Events, GatewayIntentBits, Partials, version } from 'discord.js';
import { DiscordInteractions, DiscordInteractionsErrorCodes } from '@akki256/discord-interaction';
import { guildId } from '../config.json';
import { isBlocked } from './module/functions';
import mongoose from 'mongoose';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,         GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,  GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Partials.Channel, Partials.GuildMember,
    Partials.Message, Partials.User,
  ],
  allowedMentions: { parse: [
    AllowedMentionsTypes.Role, AllowedMentionsTypes.User,
  ] },
});

const interactions = new DiscordInteractions(client);
interactions.loadInteractions(path.resolve(__dirname, './interactions'));

client.once(Events.ClientReady, () => {
  console.log('[INFO] BOT ready!');
  console.table({
    'Bot User': client.user?.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  interactions.registerCommands(guildId ?? undefined);
});

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isRepliable()) return;

  if (isBlocked(interaction.guild)) {
    interaction.reply({
      content: `\`🚫\` このサーバーでの${interaction.client.user.username}の使用は禁止されています。異議申し立ては[こちら](https://discord.gg/fVcjCNn733)`,
      ephemeral: true,
    });
  }

  interactions.run(interaction)
    .catch((err) => {
      if (err.error?.code == DiscordInteractionsErrorCodes.CommandHasCoolTime) {
        interaction.reply({ content: '`⌛` コマンドはクールダウン中です', ephemeral: true });
        return;
      }
      console.log(err);
    });
});

client.login(process.env.BOT_TOKEN);
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DBNAME });