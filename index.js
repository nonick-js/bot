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
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Guild } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const discordModals = require('discord-modals');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const setting_module = require('./modules/setting');
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

client.on('guildMemberAdd', member => {
	const { welcomeCh, welcomeMessage, welcome } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	if (welcome) {
		const embed = new MessageEmbed()
		.setTitle('WELCOME - ようこそ!')
		.setDescription(`**<@${member.id}>**さん\n**${member.guild.name}** へようこそ!\n${welcomeMessage}\n\n現在のメンバー数:**${member.guild.memberCount}**人`)
		.setThumbnail(member.user.avatarURL())
		.setColor('#57f287');
		client.channels.cache.get(welcomeCh).send({embeds: [embed]});
	}
});

client.on('guildMemberRemove', member => {
	if (welcome) {client.channels.cache.get(welcomeCh).send(`**${member.user.username}** さんがサーバーを退出しました👋`);}
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
		if (interaction.customId == "button_0") {
			if (!interaction.member.permissions.has("MANAGE_ROLES")) {
				const embed = new MessageEmbed()
				.setColor('#E84136')
				.setDescription('あなたにはリアクションロールを管理する権限がありません！')
				interaction.reply({embeds: [embed], ephemeral: true});
				return;
			}
			const modal_1 = new Modal()
			.setCustomId('modal_1')
			.setTitle('ロールを追加')
			.addComponents(
			new TextInputComponent()
				.setCustomId('textinput_1')
				.setLabel('リアクションロールに追加したいロールの名前を入力してください。')
				.setStyle('SHORT')
				.setRequired(true)
			);
			showModal(modal_1, {client, interaction});
		}


		if (interaction.customId == 'setting1-4') {
			setting_module.restore();
			interaction.reply('💥設定を初期状態に復元しました。');
		}
	}

	if (interaction.isSelectMenu()) {
		if (interaction.customId == 'setting1') {
			if (interaction.values = 'setting1-2') {
				const modal = new Modal()
				.setCustomId('modal_setting1-2')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入退室ログを送信するチャンネルのIDを入力してください。')
					.setStyle('SHORT')
					.setMaxLength(18)
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
					.setLabel('WELCOME埋め込みに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
					.setRequired(true)
				);  
				showModal(modal, {client, interaction});
			}
		}
	}
});

// modalを受け取った時の処理
client.on('modalSubmit', (modal) => {
    if(modal.customId === 'reactionmodal'){
		const title = modal.getTextInputValue('textinput-title');
		const description = modal.getTextInputValue('textinput-description');
		const embed = new MessageEmbed()
			.setTitle(`${title}`)
			.setDescription(`${description}`)
			.setColor('#365bf0');
		const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('button_0')
					.setLabel('追加')
					.setStyle('SUCCESS')
			);
		modal.reply({ embeds: [embed], components: [button] });
    }

	if (modal.customId === 'modal_1') {
		const modal_string1 = modal.getTextInputValue('textinput_1');
		const role1 = modal.guild.roles.cache.find(role => role.name === `${modal_string1}`).catch(error => {
			const embed = new MessageEmbed()
				.setColor('#E84136')
				.setDescription(`「${modal_string1}」という名前のロールを見つけられませんでした。\n正しいロール名を入力してください。`);
			modal.reply({embeds: [embed], ephemeral:true});
		});
		const embed = new MessageEmbed()
		.setDescription(role1);
		modal.reply({embeds: [embed], ephemeral: true});
	}

	if (modal.customId == 'modal_setting1-2') {

	}

	if (modal.customId == 'modal_setting1-3') {
		
	}
})

// BOTにログイン
client.login(process.env.BOT_TOKEN);