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
const { Client, Collection, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const discordModals = require('discord-modals');
const { send } = require('node:process');
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
			)
		modal.reply({ embeds: [embed], components: [button] });
    }
})

// BOTにログイン
client.login(process.env.BOT_TOKEN);