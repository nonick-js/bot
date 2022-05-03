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
const { guildId} = require('./config.json')

const interaction_commands = require('./modules/interaction');
const commands = new interaction_commands('./commands');

// モジュールを取得
const interaciton_error = require('./modules/error');

// ready
client.on('ready',async () => {
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

// コマンド・コンテキストメニューを動的に取得する
// client.commands = new discord.Collection();
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	client.commands.set(command.data.name, command);
// }

// client.contexts = new discord.Collection();
// const contextsFiles = fs.readdirSync('./contexts').filter(file => file.endsWith('.js'));
// for (const file of contextsFiles) {
// 	const context = require(`./contexts/${file}`);
// 	client.contexts.set(context.data.name, context);
// }

// コマンド処理
// client.on('interactionCreate', async interaction => {
// 	// スラッシュコマンド
// 	if (interaction.isCommand()) {
// 		const command = client.commands.get(interaction.commandName);
// 		if (!command) return;
// 		await command.execute(interaction,client).catch(error => {
// 			interaciton_error.execute(interaction,error);
// 		});
// 	}
// 	// メッセージコンテキストメニュー
// 	if (interaction.isMessageContextMenu()) {
// 		const context = client.contexts.get(interaction.commandName);
// 		if (!context) return;
// 		await context.execute(interaction,client).catch(error => {
// 			interaciton_error.interactionError.execute(interaction,error);
// 		});
// 	}
// 	// ユーザーコンテキストメニュー
// 	if (interaction.isUserContextMenu()) {
// 		const context = client.contexts.get(interaction.commandName);
// 		if (!context) return;
// 		await context.execute(interaction,client).catch(error => {
// 			interaciton_error.interactionError.execute(interaction,error);
// 		});
// 	}
// 	// ボタン
// 	if (interaction.isButton()) {
// 		console.log(interaction.customId)
// 		await interaction_button.execute(interaction,client).catch(error => {
// 			interaciton_error.interactionError.execute(interaction,error);
// 		});
// 	}
// 	// セレクトメニュー
// 	if (interaction.isSelectMenu()) {
// 		await interaction_selectmenu.execute(interaction,client).catch(error => {
// 			interaciton_error.interactionError.execute(interaction, error);
// 		});
// 	}
// });

client.on('interactionCreate',async interaction => {
    const cmd = commands.getCommand(interaction);
    try {
        cmd.exec(interaction,client);
    }
    catch (err) {
        interaciton_error.interactionError.execute(interaction,err);
    }
});

// modalを受け取った時の処理
client.on('modalSubmit', async (modal) => {
	await interaction_modal.execute(modal,client).catch(error => {
		module_error.modalError.execute(modal, error)
	});
})

client.login(process.env.BOT_TOKEN);