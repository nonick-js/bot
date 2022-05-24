const fs = require('fs');
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
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: 'banSetting', type: 'SELECT_MENU'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
        const banLog = config.get('banLog');
        const banLogCh = config.get('banLogCh');
        const banDm = config.get('banDm');
        const embed = interaction.message.embeds[0];
        if (!embed) return;

        if (interaction.values == 'setting-ban-1') {
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('banSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    {label: '全般設定', value: 'setting-ban-1', emoji: '🌐', default: true},
                    {label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-2', emoji: '966588719635267624'},
                    {label: 'DM警告機能', description: 'BANされた人に警告DMを送信', value: 'setting-ban-3', emoji: '966588719635267624'}
                ]),
            ]);
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('none')
                    .setLabel('有効な設定はありません')
                    .setStyle('SECONDARY')
                    .setDisabled(true)
            ])
            interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (interaction.values == 'setting-ban-2') {
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('banSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    {label: '全般設定', value: 'setting-ban-1', emoji: '🌐'},
                    {label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-2', emoji: '966588719635267624', default: true},
                    {label: 'DM警告機能', description: 'タイムアウトされた人に警告DMを送信', value: 'setting-ban-3', emoji: '966588719635267624'}
                ]),
            ]);
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-banLog')
                    .setLabel('ON')
                    .setStyle('SUCCESS'),
                new discord.MessageButton()
                    .setCustomId('setting-banLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            ])
            if (!banLog) {
                button.components[1].setLabel('OFF');
                button.components[1].setStyle('DANGER');
            }
            if (banLogCh == null) {
                button.components[1].setDisabled(true);
            }
            interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (interaction.values == 'setting-ban-3') {
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('banSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    {label: '全般設定', value: 'setting-ban-1', emoji: '🌐'},
                    {label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-2', emoji: '966588719635267624'},
                    {label: 'DM警告機能', description: 'タイムアウトされた人に警告DMを送信', value: 'setting-ban-3', emoji: '966588719635267624', default: true}
                ]),
            ]);
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-banDm')
                    .setLabel('ON')
                    .setStyle('SUCCESS')
            ])
            if (!banDm) {
                button.components[1].setLabel('OFF');
                button.components[1].setStyle('DANGER');
            }
            interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
        }
    }
}