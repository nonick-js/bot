//Repl.itでホスティングをする場合は、このコードを有効化する必要がある
/*
"use strict";
const http = require('http');
http.createServer(function(req, res) {
	res.write("ready nouniku!!");
	res.end();
}).listen(8080);
*/

const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageButton, Formatters } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const discordModals = require('discord-modals');
const interaction_module = require('./interaction/button');
discordModals(client);
require('dotenv').config();

// ready nouniku!!(定期)
client.once('ready', () => {
	console.log(`[DiscordBot-NoNick.js]`+'\u001b[32m'+' DiscordBotが起動しました。'+'\u001b[0m');
});

// コマンドファイルを動的に取得する
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
} 

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
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			await command.execute(interaction,client);
		} catch (error) {
			console.error(error);
			const embed = new MessageEmbed()
			.setColor('#F61E2')
			.setDescription('コマンドの実行中にエラーが発生しました。開発者にご連絡ください。')
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	}
	if (interaction.isButton()) {
		try {
			await interaction_module.execute(interaction);
		} catch (error) {
			console.error(error);
			const embed = new MessageEmbed()
			.setColor('#F61E2')
			.setDescription('インタラクションの実行中にエラーが発生しました。開発者にご連絡ください。')
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	}

	if (interaction.isSelectMenu()) {
		if (interaction.customId == 'setting1') {
			if (interaction.values == 'setting1-2') {
				const modal = new Modal()
				.setCustomId('modal_setting1-2')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入退室ログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				showModal(modal, {client, interaction});
			}
			if (interaction.values == 'setting1-3') {
				const modal = new Modal()
				.setCustomId('modal_setting1-3')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入室時埋め込みに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
					.setRequired(true)
				);
				showModal(modal, {client, interaction});
			}
		}

		if (interaction.customId == 'timeoutSetting') {
			if (interaction.values == 'timeoutSetting1') {
				const modal = new Modal()
				.setCustomId('timeoutModal1')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('タイムアウトログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				showModal(modal, {client, interaction});
			}
			if (interaction.values == 'timeoutSetting2') {
				const modal = new Modal()
				.setCustomId('timeoutModal2')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('警告DMに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('どのサーバーでタイムアウトされたか分かりやすいように、サーバー名を入れることをおすすめします。')
					.setRequired(true)
				);
				showModal(modal, {client, interaction});
			}
		}
	}
});

// modalを受け取った時の処理
client.on('modalSubmit', async (modal) => {
	if (modal.customId == 'modal_setting1-2') {
		await modal.deferReply({ephemeral: true});
		const string = modal.getTextInputValue('textinput');
		try {
			const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id;
			setting_module.change_setting("welcomeCh", messageId);
			modal.followUp({ content: `入退室ログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
		} catch (error) {
			modal.followUp({ content: `**入力した名前のチャンネルが見つかりません!**\n正しいIDにしているか、BOTが見れるチャンネルに設定しているかチェックしてください!`, ephemeral: true });
		}
	}

	if (modal.customId == 'modal_setting1-3') {
		await modal.deferReply({ephemeral: true});
		const string = modal.getTextInputValue('textinput');
		setting_module.change_setting("welcomeMessage", string);
		modal.followUp({content: 'メッセージを以下の通りに編集しました。' + Formatters.codeBlock('markdown', string), ephemeral: true});
	}

	if (modal.customId == 'timeoutModal1') {
		await modal.deferReply({ephemeral: true});
		const string = modal.getTextInputValue('textinput');
		try {
			const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id;
			setting_module.change_setting("timeoutLogCh", messageId);
			modal.followUp({ content: `タイムアウトログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
		} catch (error) {
			modal.followUp({ content: `**入力した名前のチャンネルが見つかりません!**\n正しいIDにしているか、BOTが見れるチャンネルに設定しているかチェックしてください!`, ephemeral: true });
		}
	}

	if (modal.customId == 'timeoutModal2') {
		await modal.deferReply({ephemeral: true});
		const string = modal.getTextInputValue('textinput');
		setting_module.change_setting("timeoutDmString", string);
		modal.followUp({content: 'メッセージを以下の通りに編集しました。' + Formatters.codeBlock('markdown', string), ephemeral: true});
	}

})

// BOTにログイン
client.login(process.env.BOT_TOKEN);