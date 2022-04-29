const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Formatters } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const discordModals = require('discord-modals');
discordModals(client);
require('dotenv').config();

// モジュールを取得
const interaction_button = require('./interaction/button');
const interaction_selectmenu = require('./interaction/selectmenu');
const interaction_modal = require('./interaction/modal');

// コマンドファイルを動的に取得する
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// エラー用埋め込み
const error_embed = new MessageEmbed()
	.setTitle('🛑 おっと...')
	.setDescription('処理の実行中に問題が発生しました。\n何度も同じエラーが発生する場合、以下のボタンからエラーコードと共に報告してください。')
	.setColor('RED')
const error_button = new MessageActionRow().addComponents(
	new MessageButton()
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
	console.log(`[DiscordBot-NoNick.js]`+'\u001b[32m'+' DiscordBotが起動しました。'+'\u001b[0m');
});

// メンバーが入ってきた時
client.on('guildMemberAdd', member => {
	const { welcomeCh, welcomeMessage, welcome } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	if (welcome) {
		const embed = new MessageEmbed()
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
			error_embed.addFields({name: "エラー", value: `${Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// コンテキストメニュー(メッセージ)
	if (interaction.isMessageContextMenu()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		await command.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// ボタン
	if (interaction.isButton()) {
		await interaction_button.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
	// セレクトメニュー
	if (interaction.isSelectMenu()) {
		await interaction_selectmenu.execute(interaction,client).catch(error => {
			error_embed.addFields({name: "エラー", value: `${Formatters.codeBlock(error)}`});
			interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
		});
	}
});

	// modalを受け取った時の処理
client.on('modalSubmit', async (modal) => {
	await interaction_modal.execute(modal,client).catch(error => {
		error_embed.addFields({name: "エラー", value: `${Formatters.codeBlock(error)}`});
		modal.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
	});
})

client.login(process.env.BOT_TOKEN);
