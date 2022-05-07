const fs = require('fs');
const discord = require('discord.js');

/**
 * @callback InteractionCallback
 * @param {discord.Interaction} interaction
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
    data: {customid: 'reportSetting', type: 'SELECT_MENU'},
    /**@type {InteractionCallback} */
    exec: async (interaction) => {
        const { reportRoleMention, reportRole } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        const embed = interaction.message.embeds[0];
        if (!embed) return;

        if (interaction.values == 'setting-report-1') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel('通報の送信先')
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            ])
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    {label: '全般設定', value: 'setting-report-1', emoji: '🌐', default: true},
                    {label: 'メンション機能', description: '通報受け取り時にロールをメンション', value: 'setting-report-2', emoji: '966719258430160986'},
                ]),
            ]);
            interaction.update({embeds: [embed], components: [select, button], ephemeral: true});
        }

        if (interaction.values == 'setting-report-2') {
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('setting-reportRoleMention')
                    .setLabel('ON')
                    .setStyle('SUCCESS'),
                new discord.MessageButton()
                    .setCustomId('setting-reportRole')
                    .setLabel('Mentionするロール')
                    .setEmoji('966719258430160986')
                    .setStyle('SECONDARY')
            ])
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    {label: '全般設定', value: 'setting-report-1', emoji: '🌐'},
                    {label: 'メンション機能', description: '通報受け取り時にロールをメンション', value: 'setting-report-2', emoji: '966719258430160986', default: true},
                ]),
            ]);

            if (!reportRoleMention) {
                button.components[1].setLabel('OFF');
                button.components[1].setStyle('DANGER');
            }
            if (reportRole == null) button.components[1].setDisabled(true);
            interaction.update({embeds: [embed], components: [select, button], ephemeral: true});
        }
    }
}