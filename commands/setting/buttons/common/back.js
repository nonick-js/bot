const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-back', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {

        const embed = new discord.MessageEmbed()
            .setTitle(`🛠 ${client.user.username} - 設定`)
            .setDescription([
                `${client.user.username}のコントロールパネルへようこそ!`,
                'ここではこのBOTの設定を変更することができます!',
                '```セレクトメニューから閲覧・変更したい設定を選択しよう!```',
            ].join('\n'))
            .setColor('2f3136');

        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-whatsnew')
                .setLabel('What\'s New')
                .setEmoji('966588719643631666')
                .setStyle('PRIMARY'),
        );

        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('setting-select')
                .addOptions([
                    { label: '入退室ログ', value: 'setting-welcomemessage', emoji: '🚪' },
                    { label: '通報機能', value: 'setting-report', emoji: '📢' },
                    { label: 'リンク展開', value: 'setting-linkOpen', emoji: '🔗' },
                ]),
        );

        interaction.update({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};