const fs = require('fs');
const discord = require('discord.js');
const discordModals = require('discord-modals');
const client = new discord.Client({
    intents: Object.values(discord.Intents.FLAGS),
    allowedMentions: {parse:[]},
    partials: ['CHANNEL','GUILD_MEMBER','GUILD_SCHEDULED_EVENT','MESSAGE','REACTION','USER'],
});
discordModals(client);
require('dotenv').config();

// モジュールを取得
const interaction_button = require('./interaction/button');
const interaction_selectmenu = require('./interaction/selectmenu');
const interaction_modal = require('./interaction/modal');

// コマンド・コンテキストメニューを動的に取得する
client.commands = new discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.contexts = new discord.Collection();
const contextsFiles = fs.readdirSync('./contexts').filter(file => file.endsWith('.js'));
for (const file of contextsFiles) {
	const context = require(`./contexts/${file}`);
	client.contexts.set(context.data.name, context);
}

// エラー用埋め込み
const error_embed = new discord.MessageEmbed()
	.setTitle('🛑 おっと...')
	.setDescription('処理の実行中に問題が発生しました。\n何度も同じエラーが発生する場合、以下のボタンからエラーコードと共に報告してください。')
	.setColor('RED')
const error_button = new discord.MessageActionRow().addComponents(
	new discord.MessageButton()
	.setLabel('問題を報告')
	.setStyle('LINK')
	.setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/issues/new')
)

//Repl.itでホスティングをする場合は、このコードを有効化する必要がある
/*
"use strict";
const http = require('http');
http.createServer(function(req, res) {
	res.write("ready nouniku!!");
	res.end();
}).listen(8080);
*/

// ready nouniku!!(定期)
client.once('ready', () => {
	console.log(`[${new Date().toLocaleTimeString('ja-JP')}][INFO]DiscordBotが起動しました。`);
    console.table({
        'Bot User': client.user.tag,
        'Guild(s)': `${client.guilds.cache.size} Servers`,
        'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
        'Discord.js': `v${discord.version}`,
        'Node.js': process.version,
        'Plattform': `${process.platform} | ${process.arch}`,
        'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
    });
	client.user.setActivity(`${client.guilds.cache.size} serverで導入中!`);
});

// メンバーが入ってきた時
client.on('guildMemberAdd', member => {
	const { welcomeCh, welcomeMessage, welcome } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	if (welcome) {
		const embed = new discord.MessageEmbed()
			.setTitle('WELCOME - ようこそ!')
			.setDescription(`**<@${member.id}>**さん\n**${member.guild.name}** へようこそ!\n${welcomeMessage}\n\n現在のメンバー数:**${member.guild.memberCount}**人`)
			.setThumbnail(member.user.avatarURL())
			.setColor('#57f287');
		client.channels.cache.get(welcomeCh).send({embeds: [embed]}).catch(error => {
			console.log(`[DiscordBot-NoNick.js]`+'\u001b[31m'+' [ERROR]'+'\u001b[0m'+' 指定したチャンネルに入退室ログを送れませんでした。「/setting」で正しい・BOTが送信できるチャンネルIDを送信してください。');
		})
	}
});

// メンバーが抜けた時
client.on('guildMemberRemove', member => {
	const { welcomeCh, welcome } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	if (welcome) {
		client.channels.cache.get(welcomeCh).send(`**${member.user.username}** さんがサーバーを退出しました👋`).catch(error => {
			console.log(`[DiscordBot-NoNick.js]`+'\u001b[31m'+' [ERROR]'+'\u001b[0m'+' 指定したチャンネルに入退室ログを送れませんでした。「/setting」で正しい・BOTが送信できるチャンネルIDを送信してください。');
		})
	}
});

// コマンド処理
client.on('interactionCreate', async interaction => {
	// スラッシュコマンド
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		await command.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// メッセージコンテキストメニュー
	if (interaction.isMessageContextMenu()) {
		const context = client.contexts.get(interaction.commandName);
		if (!context) return;
		await context.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// ユーザーコンテキストメニュー
	if (interaction.isUserContextMenu()) {
		const context = client.contexts.get(interaction.commandName);
		if (!context) return;
		await context.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// ボタン
	if (interaction.isButton()) {
		console.log(interaction.customId)
		await interaction_button.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// セレクトメニュー
	if (interaction.isSelectMenu()) {
		await interaction_selectmenu.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
});

// modalを受け取った時の処理
client.on('modalSubmit', async (modal) => {
	await interaction_modal.execute(modal,client).catch(error => {
		error_embed.addFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
		modal.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
	});
})

client.login(process.env.BOT_TOKEN);
