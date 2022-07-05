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
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'reportSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { reportRole, reportRoleMention } = config.get();

        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-report-1') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel('通報の送信先')
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            );
            select.components[0].options[0].default = true;
            select.components[0].options[1].default = false;
            interaction.update({ components: [select, button], ephemeral: true });
        }

        if (interaction.values == 'setting-report-2') {
            button .addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-reportRoleMention')
                    .setLabel(reportRoleMention ? '無効化' : '有効化')
                    .setStyle(reportRoleMention ? 'DANGER' : 'SUCCESS')
                    .setDisabled(reportRole ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-reportRole')
                    .setLabel('Mentionするロール')
                    .setEmoji('966719258430160986')
                    .setStyle('SECONDARY'),
            );
            select.components[0].options[0].default = false;
            select.components[0].options[1].default = true;
            interaction.update({ components: [select, button], ephemeral: true });
        }
    },
};