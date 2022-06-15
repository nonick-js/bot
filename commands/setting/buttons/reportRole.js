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
    exec: async (interaction) => {
        const modal = new discord.Modal()
            .setCustomId('setting-Role')
            .setTitle('ロールメンション')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('reportRole,1')
                        .setLabel('通報受け取り時にメンションするロールの名前を入力してください。')
                        .setStyle('PARAGRAPH')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};