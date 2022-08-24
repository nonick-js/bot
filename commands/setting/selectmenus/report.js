const discord = require('discord.js');
const swicher = require('../../../modules/swicher');

/**
 * @callback InteractionCallback
 * @param {discord.Client} client
 * @param {discord.Interaction} interaction
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
    exec: async (client, interaction, Configs) => {

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
                    .setLabel('送信先')
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            );
        }

        if (interaction.values == 'setting-report-2') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-reportRoleMention')
                    .setLabel(swicher.buttonLabelSwicher(reportRoleMention))
                    .setStyle(swicher.buttonStyleSwicher(reportRoleMention))
                    .setDisabled(swicher.buttonDisableSwicher(reportRole)),
                new discord.MessageButton()
                    .setCustomId('setting-reportRole')
                    .setLabel('ロール')
                    .setEmoji('966719258430160986')
                    .setStyle('SECONDARY'),
            );
        }

        for (let i = 0; i < select.components[0].options.length; i++) {
            select.components[0].options[i].default = false;
        }
        const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
        select.components[0].options[index].default = true;

        interaction.update({ components: [select, button], ephemeral: true });
    },
};