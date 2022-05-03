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
const modals = require('./interaciton/modals');
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
	await modals.execute(modal,client).catch(error => {
		interaciton_error.modalError.execute(modal, error)
	});
})

client.login(process.env.BOT_TOKEN);