const fs = require('fs');
const Sequelize = require('sequelize');
const discord = require('discord.js');
const discordModals = require('discord-modals');
const client = new discord.Client({
    intents: Object.values(discord.Intents.FLAGS),
    allowedMentions: {parse:['roles']},
    partials: ['CHANNEL','GUILD_MEMBER','GUILD_SCHEDULED_EVENT','MESSAGE','REACTION','USER'],
});
const sequelize = new Sequelize({
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'sql/config.sqlite',
});
discordModals(client);
require('dotenv').config();
const { guildId } = require('./config.json')

const interaction_commands = require('./modules/interaction');
const commands = new interaction_commands('./commands');
commands.debug = false;

// モジュールを取得
const modals = require('./interaciton/modals');
const guildMemberAdd = require('./events/guildMemberAdd');
const guildMemberRemove = require('./events/guildMemberRemove');

// sqliteのテーブルの作成
const Configs = sequelize.define('configs', {
	serverId: {type: Sequelize.STRING, unique: true},
    laungage: {type: Sequelize.STRING, defaultValue: "ja_JP"},
    welcome: {type: Sequelize.BOOLEAN, defaultValue: false},
    welcomeCh: {type: Sequelize.STRING, defaultValue: null},
    welcomeMessage: {type: Sequelize.TEXT, defaultValue: "まずはルールを確認しよう!"},
    leave: {type: Sequelize.BOOLEAN, defaultValue: false},
    leaveCh: {type: Sequelize.STRING, defaultValue: null},
    reportCh: {type: Sequelize.STRING, defaultValue: null},
    reportRoleMention: {type: Sequelize.BOOLEAN, defaultValue: false},
    reportRole: {type: Sequelize.STRING, defaultValue: null},
    timeoutLog: {type: Sequelize.BOOLEAN, defaultValue: false},
    timeoutLogCh: {type: Sequelize.STRING, defaultValue: null},
    timeoutDm: {type: Sequelize.BOOLEAN, defaultValue: false},
    banLog: {type: Sequelize.BOOLEAN, defaultValue: false},
    banLogCh: {type: Sequelize.STRING, defaultValue: null},
    banDm: {type: Sequelize.BOOLEAN, defaultValue: false},
});

//Repl.itでホスティングをする場合は、このコードを有効化する必要がある
/*
"use strict";
const http = require('http');
http.createServer(function(req, res) {
	res.write("ready nouniku!!");
	res.end();
}).listen(8080);
*/

// デバッグモード
// client.on("debug", ( e ) => console.log(e));

// ready nouniku!!
client.on('ready',async () => {
    Configs.sync({alter: true});
    console.log(`[${new Date().toLocaleTimeString('ja-JP')}][INFO]ready!`);
    console.table({
        'Bot User': client.user.tag,
        'Guild(s)': `${client.guilds.cache.size} Servers`,
        'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
        'Discord.js': `v${discord.version}`,
        'Node.js': process.version,
        'Plattform': `${process.platform} | ${process.arch}`,
        'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
    });
	commands.register(client, guildId);
    client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`);
});

// サーバーに参加した時
client.on('guildCreate',async guild => {
    await Configs.findOrCreate({where:{serverId: guild.id}});
    client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`);
});

// サーバーから退出させられた時
client.on('guildDelete',async () => {
    client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`);
});

// メンバーが参加したとき
client.on('guildMemberAdd',async member => {
    guildMemberAdd.execute(client, member, Configs);
});

// メンバーが抜けた時
client.on('guildMemberRemove',async member => {
    guildMemberRemove.execute(client, member, Configs);
});

const error_embed = new discord.MessageEmbed()
    .setTitle('🛑 エラー')
    .setDescription('何度も同じエラーが発生する場合、以下のボタンからエラーコードと直前の動作を記載して下のボタンから報告してください。')
    .setColor('RED');
const error_button = new discord.MessageActionRow().addComponents(
    new discord.MessageButton()
        .setLabel('問題を報告')
        .setStyle('LINK')
        .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/issues/new')
);

// Interaction処理
client.on('interactionCreate',async interaction => {
    await Configs.findOrCreate({where:{serverId: interaction.guild.id}});
    const cmd = commands.getCommand(interaction);
    try {
        Configs.findOrCreate({where:{serverId: interaction.guild.id}});
        cmd.exec(interaction,client,Configs);
    }
    catch (err) {
        console.log(err);
        error_embed.setFields({name: "エラー", value: `${discord.Formatters.codeBlock(err)}`});
	    interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
    }
});

// modalを受け取った時の処理
client.on('modalSubmit', async (modal) => {
    await Configs.findOrCreate({where:{serverId: modal.guild.id}});
    try {
        Configs.findOrCreate({where:{serverId: modal.guild.id}});
        await modals.execute(modal,client,Configs);
    }
	catch (err) {
        console.log(err);
        error_embed.setFields({name: "エラー", value: `${discord.Formatters.codeBlock(err)}`});
	    modal.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
    }
});

client.login(process.env.BOT_TOKEN);