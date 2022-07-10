const Sequelize = require('sequelize');
const discord = require('discord.js');
const discord_player = require('discord-player');
const client = new discord.Client({
    intents: Object.values(discord.Intents.FLAGS),
    allowedMentions: { parse:['roles'] },
    partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER'],
});
const sequelize = new Sequelize({
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'sql/config.sqlite',
});
require('dotenv').config();
const { guildId, guildCommand, blackList_guild, blackList_user, debugMode, replitMode } = require('./config.json');
const player = new discord_player.Player(client);

const interaction_commands = require('./modules/interaction');
const commands = new interaction_commands('./commands');
commands.debug = false;

// モジュールを取得
const guildMemberAdd = require('./events/guildMemberAdd/index');
const guildMemberRemove = require('./events/guildMemberRemove/index');
const trackStart = require('./events/trackStart/index');
const messageCreate = require('./events/messageCreate/index');
const connectionError = require('./events/connectionError/index');

// sqliteのテーブルの作成
const Configs = sequelize.define('configs', {
	serverId: { type: Sequelize.STRING, unique: true },
    language: { type: Sequelize.STRING, defaultValue: 'ja_JP' },
    welcome: { type: Sequelize.BOOLEAN, defaultValue: false },
    welcomeCh: { type: Sequelize.STRING, defaultValue: null },
    welcomeMessage: { type: Sequelize.TEXT, defaultValue: 'まずはルールを確認しよう!' },
    leave: { type: Sequelize.BOOLEAN, defaultValue: false },
    leaveCh: { type: Sequelize.STRING, defaultValue: null },
    reportCh: { type: Sequelize.STRING, defaultValue: null },
    reportRoleMention: { type: Sequelize.BOOLEAN, defaultValue: false },
    reportRole: { type: Sequelize.STRING, defaultValue: null },
    timeoutLog: { type: Sequelize.BOOLEAN, defaultValue: false },
    timeoutLogCh: { type: Sequelize.STRING, defaultValue: null },
    timeoutDm: { type: Sequelize.BOOLEAN, defaultValue: false },
    banLog: { type: Sequelize.BOOLEAN, defaultValue: false },
    banLogCh: { type: Sequelize.STRING, defaultValue: null },
    banDm: { type: Sequelize.BOOLEAN, defaultValue: false },
    linkOpen: { type: Sequelize.BOOLEAN, defaultValue: false },
    dj: { type: Sequelize.BOOLEAN, defaultValue: false },
    djRole: { type: Sequelize.STRING, defaultValue: null },
});

if (replitMode) {
    'use strict';
    const http = require('http');
    http.createServer(function(req, res) {
        res.write('ready nouniku!!');
        res.end();
    }).listen(8080);
}

client.on('debug', (e) => {if (debugMode) console.log(e);});

// ready nouniku!!
client.on('ready', () => {
    Configs.sync({ alter: true });
    console.log(`[${new Date().toLocaleTimeString('ja-JP')}][INFO]ready!`);
    console.table({
        'Bot User': client.user.tag,
        'Guild(s)': `${client.guilds.cache.size} Servers`,
        'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
        'Discord.js': `v${discord.version}`,
        'Node.js': process.version,
        'Plattform': `${process.platform} | ${process.arch}`,
        'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
    });
    if (guildCommand) commands.register(client, guildId);
    else commands.register(client);
    client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`);
});

client.on('guildCreate', () => client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`));
client.on('guildDelete', () => client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`));

client.on('guildMemberAdd', member => moduleExecute(member, guildMemberAdd));
client.on('guildMemberRemove', member => moduleExecute(member, guildMemberRemove));
client.on('messageCreate', message => moduleExecute(message, messageCreate));

player.on('trackStart', async (queue, track) => {
    const config = await Configs.findOne({ where: { serverId: queue.guild.id } });
    const language = require(`./language/${config.get('language')}`);
    trackStart.execute(client, queue, track, language);
});
player.on('connectionError', async (queue, error) => {
    const config = await Configs.findOne({ where: { serverId: queue.guild.id } });
    const language = require(`./language/${config.get('language')}`);
    connectionError.execute(client, queue, error, language);
});
player.on('botDisconnect', queue => queue.destroy());
player.on('channelEmpty', queue => queue.destroy());

client.on('interactionCreate', async interaction => {
    await Configs.findOrCreate({ where:{ serverId: interaction.guildId } });
    const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
    const language = require(`./language/${config.get('language')}`);

    if (blackList_guild.includes(interaction.guild.id) || blackList_user.includes(interaction.guild.ownerId)) {
        const embed = new discord.MessageEmbed()
            .setDescription(language('BLACKLIST_MESSAGE', client.user.username))
            .setColor('RED');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const cmd = commands.getCommand(interaction);
    try {
        cmd.exec(client, interaction, Configs, language, player);
    }
    catch (e) {
        console.log(e);
    }
});

async function moduleExecute(param, module) {
    if (blackList_guild.includes(param.guild.id) || blackList_user.includes(param.guild.ownerId)) return;

    await Configs.findOrCreate({ where:{ serverId: param.guild.id } });
    const config = await Configs.findOne({ where: { serverId: param.guild.id } });
    const language = require(`./language/${config.get('language')}`);

    try {
        module.execute(client, param, Configs, language);
    } catch (e) {
        console.log(`[エラー!] サーバーID:${param.guild.id}\n${e}`);
    }
}

client.login(process.env.BOT_TOKEN);