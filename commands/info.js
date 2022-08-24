const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client}
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'info', description: 'このBOTについて', type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        const embed = new discord.MessageEmbed()
            .setTitle(client.user.username)
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
            .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
            .setDescription([
                '「使いやすい」をモットーにした**完全無料の多機能BOT!**',
                '誰でも簡単にBOTを使えるような開発をしています!\n',
                '🔹**搭載中の機能**',
                '`入退室ログ` `通報機能` `リアクションロール` `timeoutコマンド` `banコマンド`'].join('\n'))
            .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' })
            .setColor('WHITE');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setLabel('サポートサーバー')
                .setStyle('LINK')
                .setURL('https://discord.gg/fVcjCNn733'),
            new discord.MessageButton()
                .setLabel('ドキュメント')
                .setStyle('LINK')
                .setURL('https://nonick.gitbook.io/nonick.js'),
        );
        interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};