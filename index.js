const discord = require('discord.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { DiscordInteractions } = require('@djs-tools/interactions');
const { guildId, guildCommand, blackList, statusMessage, dbName } = require('./config.json');
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
interactions.loadInteractions('./commands');

mongoose.connect(process.env.MONGODB_URI, {
  dbName: dbName,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(console.info('mongoDBにログインしました。'));

const Configs = require('./schemas/configSchema');
const FeatureData = require('./schemas/featureDataSchema');

client.once('ready', () => {
  console.info(`[${new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })}][INFO]ready!`);
  console.table({
    'Bot User': client.user.tag,
    'Guild(s)': `${client.guilds.cache.size} Servers`,
    'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${discord.version}`,
    'Node.js': process.version,
    'Platform': `${process.platform} | ${process.arch}`,
    'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
  });

  client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing });
  if (guildCommand) interactions.registerCommands(guildId);
  else interactions.registerCommands();

  cron.schedule('0 * * * *', date => { require('./cron/verificationChange/index').execute(client, date); });
});

client.on('guildCreate', () => client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing }));
client.on('guildDelete', guild => {
  client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing });
  Configs.findOneAndDelete({ serverId: guild.id });
  FeatureData.findOneAndDelete({ serverId: guild.id });
});

client.on('guildBanAdd', ban => require('./events/guildBanAdd/index').execute(ban));
client.on('guildBanRemove', member => require('./events/guildBanRemove/index').execute(member));
client.on('guildMemberAdd', member => require('./events/guildMemberAdd/index').execute(member));
client.on('guildMemberRemove', member => require('./events/guildMemberRemove/index').execute(member));
client.on('guildMemberUpdate', (oldMember, newMember) => require('./events/guildMemberUpdate/index').execute(oldMember, newMember));
client.on('messageCreate', message => require('./events/messageCreate/index').execute(message));
client.on('messageDelete', message => require('./events/messageDelete/index').execute(message));

client.on('interactionCreate', async interaction => {
  if (blackList.guilds.includes(interaction.guild?.id) || blackList.users.includes(interaction.guild?.ownerId)) {
    const embed = new discord.EmbedBuilder()
      .setDescription(`このサーバーでの**${client.user.username}**の使用は開発者により禁止されています。禁止された理由や詳細は\`nonick-mc#1017\`までお問い合わせください。`)
      .setColor('Red');
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
  if (interaction.guild) {
    await Configs.findOrCreate({ serverId: interaction.guildId });
  }

  interactions.run(interaction).catch(async err => {
    if (err.code == 1) {
      const embed = new discord.EmbedBuilder()
        .setAuthor({ name: 'コマンドは只今クールタイム中です！時間を置いて再試行してください。', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    else if (err.code == 0) {
      if (!interaction.guild) return;
      require('./commands/reactionRole/panel/button/rolePanel_interaction').execute(interaction);
    }
    else {
      console.warn(err);
    }
  });
});

client.login(process.env.BOT_TOKEN);