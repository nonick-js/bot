const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'info',
        description: 'このBOTについて',
        dmPermission: true,
        type: 'CHAT_INPUT',
    },
    exec: (interaction) => {
        const embed = new EmbedBuilder()
            .setTitle(interaction.client.user.username)
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
            .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
            .setDescription([
                '「使いやすい」をモットーにした**完全無料の多機能BOT!**',
                '誰でも簡単にBOTを使えるような開発をしています!\n',
                '🔹**搭載中の機能**',
                '`入退室ログ` `通報機能` `リアクションロール` `timeoutコマンド` `banコマンド`'].join('\n'))
            .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' })
            .setColor('White');

        const button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('サポートサーバー')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/fVcjCNn733'),
            new ButtonBuilder()
                .setLabel('ドキュメント')
                .setStyle(ButtonStyle.Link)
                .setURL('https://nonick.gitbook.io/nonick.js'),
        );
        interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};
module.exports = [ ping_command ];