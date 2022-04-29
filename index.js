const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const discordModals = require('discord-modals');
discordModals(client);
require('dotenv').config();

// interactionモジュール達
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
			try {
				await command.execute(interaction,client);
			} catch (error) {
				console.error(error);
				const embed = new MessageEmbed()
					.setColor('#F61E2')
					.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
				await interaction.reply({embeds: [embed], ephemeral: true});
			}
		}
		// コンテキストメニュー(メッセージ)
		if (interaction.isMessageContextMenu()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.execute(interaction,client);
			} catch (error) {
				console.error(error);
				const embed = new MessageEmbed()
					.setColor('#F61E2')
					.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
				await interaction.reply({embeds: [embed], ephemeral: true});
			}
		}
		// ボタン
		if (interaction.isButton()) {
			try {
				await interaction_button.execute(interaction,client);
			} catch (error) {
				console.error(error);
				const embed = new MessageEmbed()
					.setColor('#F61E2')
					.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
				await interaction.reply({embeds: [embed], ephemeral: true});
			}
		}

		// セレクトメニュー
		if (interaction.isSelectMenu()) {
			try {
				await interaction_selectmenu.execute(interaction,client);
			} catch (error) {
				console.error(error);
				const embed = new MessageEmbed()
					.setColor('#F61E2')
					.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
				await interaction.reply({embeds: [embed], ephemeral: true});
			}
		}
	});

	// modalを受け取った時の処理
	client.on('modalSubmit', async (modal) => {
		try {
			await interaction_modal.execute(modal,client);
		} catch (error) {
			console.error(error);
			const embed = new MessageEmbed()
				.setColor('#F61E2')
				.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
			await modal.reply({embeds: [embed], ephemeral: true});
		}
	})

	// BOTにログイン
	client.login(process.env.BOT_TOKEN);
