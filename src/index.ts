import { AllowedMentionsTypes, Client, Colors, EmbedBuilder, Events, GatewayIntentBits, Partials, codeBlock, version } from 'discord.js';
import dotenv from 'dotenv';
import { DiscordEvents } from '@modules/events';
import { DiscordInteractions, ErrorCodes, InteractionsError } from '@akki256/discord-interaction';
import mongoose from 'mongoose';
import path from 'path';
import { guildId, admin } from 'config.json';
import { Cron } from '@modules/cron';

dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.User,
  ],
  allowedMentions: {
    parse: [
      AllowedMentionsTypes.Role,
      AllowedMentionsTypes.User,
    ],
  },
});

const events = new DiscordEvents(client);
const interactions = new DiscordInteractions(client);
interactions.loadRegistries(path.resolve(__dirname, './interactions'));

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

  interactions.registerCommands({ guildId: guildId ?? undefined, syncWithCommand: true });
  events.register(path.resolve(__dirname, './events'));
  Cron.registerFiles(path.resolve(__dirname, './cron'));
});

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isRepliable()) return;

  interactions.run(interaction)
    .catch(err => {
      if (
        err instanceof InteractionsError &&
        err.code === ErrorCodes.CommandHasCoolTime
      ) return interaction.reply({ content: '`⌛` コマンドはクールダウン中です', ephemeral: true });
      console.error(err);
    });
});

process.on('uncaughtException', (err) => {
  console.error(err);

  client.channels.fetch(admin.error).then(channel => {
    if (!channel?.isTextBased()) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('`❌` 例外が発生しました')
          .setDescription(codeBlock(`${err.stack}`))
          .setColor(Colors.Red)
          .setTimestamp(),
      ],
    });
  });
});

client.login();
mongoose.connect(process.env.DB_URI, { dbName: process.env.DB_DBNAME });