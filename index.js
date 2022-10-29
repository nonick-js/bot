const discord = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');

const { guildId, statusMessage, dbName, beta } = require('./config.json');
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

const { DiscordInteractions } = require('@djs-tools/interactions');
const interactions = new DiscordInteractions(client);
interactions.loadInteractions('./commands');

mongoose.connect(process.env.MONGODB_URI, {
  dbName: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.log(`[${new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })}][INFO] mongoDB login!`));

const Configs = require('./schemas/configSchema');
const FeatureData = require('./schemas/featureDataSchema');

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

  client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} servers`, type: discord.ActivityType.Competing });
  interactions.registerCommands(guildId);

  cron.schedule('0 * * * *', date => { require('./cron/verificationChange').execute(client, date); });
});

client.on('guildCreate', () => client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} servers`, type: discord.ActivityType.Competing }));
client.on('guildDelete', guild => {
  client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} servers`, type: discord.ActivityType.Competing });
  Configs.findOneAndDelete({ serverId: guild.id });
  FeatureData.findOneAndDelete({ serverId: guild.id });
});

client.on('guildBanAdd', require('./events/guildBanAdd').execute);
client.on('guildBanRemove', require('./events/guildBanRemove').execute);
client.on('guildMemberAdd', require('./events/guildMemberAdd').execute);
client.on('guildMemberRemove', require('./events/guildMemberRemove/index').execute);
client.on('guildMemberUpdate', require('./events/guildMemberUpdate/index').execute);
client.on('messageCreate', require('./events/messageCreate/index').execute);

client.on('interactionCreate', async interaction => {
  if (await utils.isBlocked(interaction)) {
    const BlockByBeta = new discord.EmbedBuilder()
      .setDescription('`❌` このBOTを使用するにはサーバーの所有者が**BETAプログラム**に参加する必要があります。')
      .setColor('Red');

    const BlockByBlackList = new discord.EmbedBuilder()
      .setDescription([
        `このサーバーでの**${client.user.username}**の使用は開発者により禁止されています。`,
        '禁止された理由や詳細は`nonick-mc#1017`までお問い合わせください。',
      ].join('\n'))
      .setColor('Red');

    return interaction.reply({ embeds: [beta.enable ? BlockByBeta : BlockByBlackList], ephemeral: true });
  }

  interactions.run(interaction).catch(async err => {
    switch (err.code) {
      case 0:
        if (interaction.guild) require('./commands/reactionRole/panel/button/rolePanel_interaction').execute;
        break;
      case 1: {
        const embed = new discord.EmbedBuilder()
          .setDescription('`⌛` コマンドはクールダウン中です... 時間を置いて再試行してください。')
          .setColor('Yellow');
        interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }
      default:
        console.warn(err);
        break;
    }
  });
});

client.login(process.env.BOT_TOKEN);