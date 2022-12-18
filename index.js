const { GatewayIntentBits, Client, AllowedMentionsTypes, Partials, version, ActivityType, Events, EmbedBuilder, Colors } = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const { DiscordInteractions } = require('@akki256/discord-interaction');
const eventsHandler = require('./modules/events');

const { guildCommand, guildId } = require('./config.json');
const { isBlocked } = require('./utils/functions');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { parse: [ AllowedMentionsTypes.Role ] },
  partials: [ Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User ],
});

const interactions = new DiscordInteractions(client);
interactions.loadInteractions('./interactions');

const eventsPath = path.join(__dirname, 'events');
eventsHandler(eventsPath, client);

const Configs = require('./schemas/configSchema');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.MONGODB_DBNAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.once(Events.ClientReady, () => {
  console.log(`[${new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })}][INFO] BOT ready!`);
  console.table({
    'Bot User': client.user.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: ActivityType.Competing });
  interactions.registerCommands(guildCommand ? guildId : undefined);

  cron.schedule('0 * * * *', date => { require('./cron/verificationChange').execute(client, date); });
});

client.on(Events.GuildCreate, () => {
  client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: ActivityType.Competing });
});

client.on(Events.GuildDelete, guild => {
  client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: ActivityType.Competing });
  Configs.findOneAndDelete({ serverId: guild.id });
});

client.on(Events.InteractionCreate, async interaction => {
  if (isBlocked(interaction.guild)) {
    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username}の使用は開発者により禁止されています`)
      .setDescription('このサーバーではBOTを使用することはできません。禁止された理由や詳細・異議申し立ては` nonick-mc#1017 `までご連絡ください')
      .setColor(Colors.Red);

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  interactions.run(interaction).catch(err => {
    if (err.code == 1) {
      const embed = new EmbedBuilder()
        .setDescription('`⌛` コマンドはクールダウン中です... 時間を置いて再試行してください。')
        .setColor(Colors.Yellow);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    console.log(err);
  });
});

client.login(process.env.BOT_TOKEN);