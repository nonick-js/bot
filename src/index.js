const discord = require('discord.js');
const cron = require('node-cron');
const mongoose = require('mongoose');
const { DiscordInteractions } = require('@djs-tools/interactions');
const { guildId, guildCommand, blackList, statusMessage } = require('../../config.json');
require('dotenv').config();

const client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildBans,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.MessageContent,
    ],
    allowedMentions: { parse: [ discord.AllowedMentionsTypes.Role ] },
    partials: [ discord.Partials.Channel, discord.Partials.GuildMember, discord.Partials.Message, discord.Partials.User ],
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDBへの接続が完了しました'));

const interactions = new DiscordInteractions(client);
interactions.loadInteractions('./commands');

client.once('ready', () => {
    console.log(`[${new Date().toLocaleTimeString('ja-JP')}][INFO]ready!`);
    console.table({
        'Bot User': client.user.tag,
        'Guild(s)': `${client.guilds.cache.size} Servers`,
        'Watching': `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
        'Discord.js': `v${discord.version}`,
        'Node.js': process.version,
        'Platform': `${process.platform} | ${process.arch}`,
        'Memory': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`,
    });

    client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing });
    if (guildCommand) interactions.registerCommands(guildId);
    else interactions.registerCommands();

    cron.schedule('0 * * * *', date => {
        require('../cron/verificationChange/index').execute(client, date);
    });
});

// client.on('guildCreate', () => client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing }));
// client.on('guildDelete', guild => {
//     client.user.setActivity({ name: `${statusMessage} | ${client.guilds.cache.size} server`, type: discord.ActivityType.Competing });
//     basicModel.destroy({ where: { serverId: guild.id } });
//     logModel.destroy({ where: { serverId: guild.id } });
//     verificationModel.destroy({ where: { serverId: guild.id } });
// });

// client.on('guildBanAdd', ban => moduleExecute(require('../events/guildBanAdd/index'), ban));
// client.on('guildBanRemove', member => moduleExecute(require('../events/guildBanRemove/index'), member));
// client.on('guildMemberAdd', member => moduleExecute(require('../events/guildMemberAdd/index'), member));
// client.on('guildMemberRemove', member => moduleExecute(require('../events/guildMemberRemove/index'), member));
// client.on('guildMemberUpdate', (oldMember, newMember) => moduleExecute(require('../events/guildMemberUpdate/index'), oldMember, newMember));
// client.on('messageCreate', message => moduleExecute(require('../events/messageCreate/index'), message));

client.on('interactionCreate', async interaction => {
    if (blackList.guilds.includes(interaction.guild?.id) || blackList.users.includes(interaction.guild?.ownerId)) {
        const embed = new discord.EmbedBuilder()
            .setDescription(`このサーバーでの**${client.user.username}**の使用は開発者により禁止されています。禁止された理由や詳細は\`nonick-mc#1017\`までお問い合わせください。`)
            .setColor('Red');
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (interaction.guild) {}
    interactions.run(interaction).catch(err => {if (err.code !== 0) console.warn(err);});
});

async function moduleExecute(module, param, param2) {
    if (blackList.guilds.includes(param.guild?.id) || blackList.users.includes(param.guild?.ownerId)) return;
    if (param.guild) {}
    module.execute(param, param2);
}

client.login(process.env.BOT_TOKEN);