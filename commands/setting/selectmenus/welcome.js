const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'welcomeSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const welcome = config.get('welcome');
        const welcomeCh = config.get('welcomeCh');
        const leave = config.get('leave');
        const leaveCh = config.get('leaveCh');

        /** メッセージ元の埋め込み */
        const embed = interaction.message.embeds[0];
        /** メッセージ元のセレクトメニュー */
        const select = interaction.message.components[0];

        if (interaction.values == 'setting-welcome-1') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(welcome ? '無効化' : '有効化')
                    .setStyle(welcome ? 'DANGER' : 'SUCCESS')
                    .setDisabled(welcomeCh == null ? true : false),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel('メッセージ')
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            ]);
            select.components[0]
                .spliceOptions(0, 1, { label: '入室ログ', value: 'setting-welcome-1', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true })
                .spliceOptions(1, 1, { label: '退室ログ', value: 'setting-welcome-2', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' });
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
        else if (interaction.values == 'setting-welcome-2') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-leave')
                    .setLabel(leave ? '無効化' : '有効化')
                    .setStyle(leave ? 'DANGER' : 'SUCCESS')
                    .setDisabled(leaveCh == null ? true : false),
                new discord.MessageButton()
                    .setCustomId('setting-leaveCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            ]);
            select.components[0]
                .spliceOptions(0, 1, { label: '入室ログ', value: 'setting-welcome-1', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624' })
                .spliceOptions(1, 1, { label: '退室ログ', value: 'setting-welcome-2', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624', default: true });
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};