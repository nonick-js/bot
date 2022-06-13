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
    data: { customid: 'setting-timeoutLogCh', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const modal = new discord.Modal()
            .setCustomId('setting-Channel')
            .setTitle('Timeoutログ')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('timeoutLogCh,0')
                        .setLabel('タイムアウトコマンドのログを送信するチャンネルの名前を入力してください。')
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};