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
    data: { customid: 'setting-reportRole', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const modal = new discord.Modal()
            .setCustomId('setting-Role')
            .setTitle(language('SETTING_REPORT_REPORTROLE_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('reportRole,1')
                        .setLabel(language('SETTING_REPORT_REPORTROLE_MODAL_LABEL'))
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};