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
    data: { customid: 'banSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const banLog = config.get('banLog');
        const banLogCh = config.get('banLogCh');
        const banDm = config.get('banDm');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];

        if (interaction.values == 'setting-ban-1') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-banLog')
                    .setLabel(banLog ? '無効化' : '有効化')
                    .setStyle(banLog ? 'DANGER' : 'SUCCESS')
                    .setDisabled(banLogCh == null ? true : false),
                new discord.MessageButton()
                    .setCustomId('setting-banLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            ]);
            select.components[0]
                .spliceOptions(0, 1, { label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-1', emoji: '966588719635267624', default: true })
                .spliceOptions(1, 1, { label: 'DM警告機能', description: 'タイムアウトされた人に警告DMを送信', value: 'setting-ban-2', emoji: '966588719635267624' });
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
        else if (interaction.values == 'setting-ban-2') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-banDm')
                    .setLabel(banDm ? '無効化' : '有効化')
                    .setStyle(banDm ? 'DANGER' : 'SUCCESS'),
            ]);
            select.components[0]
                .spliceOptions(0, 1, { label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-1', emoji: '966588719635267624' })
                .spliceOptions(1, 1, { label: 'DM警告機能', description: 'タイムアウトされた人に警告DMを送信', value: 'setting-ban-2', emoji: '966588719635267624', default: true });
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};