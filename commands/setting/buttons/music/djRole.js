const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-djRole', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const modal = new discord.Modal()
            .setCustomId('setting-djRole')
            .setTitle(language('SETTING_MUSIC_DJROLE_MODAL_TITLE'))
            .setComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel(language('SETTING_MUSIC_DJROLE_MODAL_LABEL'))
                        .setMaxLength(100)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};