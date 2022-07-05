const discord = require('discord.js');

/**
 * @callback InteractionCallback
 * @param {discord.MessageContextMenuInteraction} interaction
 * @param {discord.Client} client
 * @returns {void}
 */
/**
 * @typedef ContextMenuData
 * @prop {string} customid
 * @prop {"BUTTON"|"SELECT_MENU"} type
 */

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'setting', description: 'BOTのコントロールパネル(設定)を開きます', type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            const embed = new discord.MessageEmbed()
                .setColor('RED')
                .setDescription([
                    '❌ **あなたにはこれを実行する権限がありません！**',
                    '必要な権限: `サーバー管理`',
                ].join('\n'));
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.MessageEmbed()
            .setTitle('🛠 NoNICK.js - 設定')
            .setDescription([
                'NoNICK.jsのコントロールパネルへようこそ!',
                'ここではこのBOTの設定を変更することができます!',
                discord.Formatters.codeBlock('セレクトメニューから閲覧・変更したい設定を選択しよう!'),
            ].join('\n'))
            .setColor('GREEN');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-whatsnew')
                .setLabel('What\'s New')
                .setEmoji('966588719643631666')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('setting-language')
                .setEmoji('🌐')
                .setStyle('SECONDARY'),
        );
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('setting-select')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: '入退室ログ', value: 'setting-welcomemessage', emoji: '🚪' },
                    { label: '通報機能', value: 'setting-report', emoji: '📢' },
                    { label: 'リンク展開', value: 'setting-linkOpen', emoji: '🔗' },
                    { label: '/music コマンド', value: 'setting-music', emoji: '966596708484149289' },
                    { label: '/timeout コマンド', value: 'setting-timeout', emoji: '966596708484149289' },
                    { label: '/ban コマンド', value: 'setting-ban', emoji: '966596708484149289' },
                ]),
        );
        interaction.reply({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};