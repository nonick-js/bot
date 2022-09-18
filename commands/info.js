const discord = require('discord.js');
const feature = [
    '入退室メッセージ',
    '通報機能',
    'ログ機能',
    '認証レベル自動変更機能',
    'リアクションロール',
    'timeoutコマンド',
];

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'info',
        description: 'このBOTについて',
        dmPermission: true,
        type: 'CHAT_INPUT',
    },
    exec: (interaction) => {
        const embed = new discord.EmbedBuilder()
            .setTitle(interaction.client.user.username)
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
            .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
            .setDescription([
                '「使いやすい」をモットーにした**完全無料の多機能BOT!**',
                '開発者がサーバーを運営していく上で「あったらいいな」と思った機能を開発、搭載しています！\n',
                '🔹**搭載中の機能**',
                feature.map(v => `\`${v}\``).join(' '),
            ].join('\n'))
            .setColor('White')
            .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' });
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setLabel('サポートサーバー')
                .setStyle(discord.ButtonStyle.Link)
                .setURL('https://discord.gg/fVcjCNn733'),
            new discord.ButtonBuilder()
                .setLabel('ドキュメント')
                .setStyle(discord.ButtonStyle.Link)
                .setURL('https://docs.nonick-js.com'),
        );

        interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};
module.exports = [ ping_command ];