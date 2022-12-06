const discord = require('discord.js');
const { DiscordInteractions } = require('@akki256/discord-interaction');
const mongoose = require('mongoose');
const cron = require('node-cron');

const { guildCommand, guildId } = require('./config.json');
const utils = require('./modules/utils');
require('dotenv').config();

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildBans,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.MessageContent,
  ],
  allowedMentions: { parse: [ discord.AllowedMentionsTypes.Role ] },
  partials: [ discord.Partials.Channel, discord.Partials.GuildMember, discord.Partials.Message, discord.Partials.User ],
});

const interactions = new DiscordInteractions(client);
interactions.loadInteractions('./interactions');

const Configs = require('./schemas/configSchema');
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.MONGODB_DBNAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.once('ready', () => {
  console.log(`[${new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })}][INFO] BOT ready!`);
  console.table({
    'Bot User': client.user.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${discord.version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: discord.ActivityType.Competing });
  interactions.registerCommands(guildCommand ? guildId : undefined);

  cron.schedule('0 * * * *', date => { require('./cron/verificationChange').execute(client, date); });
});

client.on('guildCreate', () => client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: discord.ActivityType.Competing }));
client.on('guildDelete', guild => {
  client.user.setActivity({ name: `${client.guilds.cache.size} サーバー`, type: discord.ActivityType.Competing });
  Configs.findOneAndDelete({ serverId: guild.id });
});

client.on('guildBanAdd', require('./events/guildBanAdd').execute);
client.on('guildBanRemove', require('./events/guildBanRemove').execute);
client.on('guildMemberAdd', require('./events/guildMemberAdd').execute);
client.on('guildMemberRemove', require('./events/guildMemberRemove/index').execute);
client.on('guildMemberUpdate', require('./events/guildMemberUpdate/index').execute);
client.on('messageCreate', require('./events/messageCreate/index').execute);

client.on('interactionCreate', async interaction => {
  if (utils.isBlocked(interaction.guild)) {
    const embed = new discord.EmbedBuilder()
      .setTitle(`${client.user.username}の使用は開発者により禁止されています`)
      .setDescription('このサーバーではBOTを使用することはできません。禁止された理由や詳細・異議申し立ては` nonick-mc#1017 `までご連絡ください')
      .setColor(discord.Colors.Red);

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  interactions.run(interaction).catch(async err => {
    if (err.code == 1) {
      const embed = new discord.EmbedBuilder()
        .setDescription('`⌛` コマンドはクールダウン中です... 時間を置いて再試行してください。')
        .setColor(discord.Colors.Yellow);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    console.log(err);
  });
});

client.login(process.env.BOT_TOKEN);