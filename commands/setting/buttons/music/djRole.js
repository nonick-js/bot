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
    exec: async (interaction) => {
        const modal = new discord.Modal()
            .setCustomId('setting-djRole')
            .setTitle('DJロール')
            .setComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel('DJロールとして使用するロールの名前を入力してください。')
                        .setMaxLength(100)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};