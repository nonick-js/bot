//Repl.itでホスティングをする場合は、このコードを有効化する必要がある

/*
"use strict";
const http = require('http');
http.createServer(function(req, res) {
	res.write("ready nouniku!!");
	res.end();
}).listen(8080);
*/

const fs = require('node:fs');
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton, Guild } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const discordModals = require('discord-modals');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
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
	if(modal.customId === 'modal_1') {
		const modal_string1 = modal.getTextInputValue('textinput_1');
		try {
			const role1 = modal.guild.roles.cache.find(role => role.name === `${modal_string1}`);
			const embed = new MessageEmbed()
			.setDescription(role1);
			modal.reply({embeds: [embed], ephemeral: true});
		}
		catch (error) {
			const embed = new MessageEmbed()
				.setColor('#E84136')
				.setDescription(`「${modal_string1}」という名前のロールを見つけられませんでした。\n正しいロール名を入力してください。`);
			modal.reply({embeds: [embed], ephemeral:true});
		}
	}
})

// BOTにログイン
client.login(process.env.BOT_TOKEN);