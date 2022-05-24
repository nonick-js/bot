const fs = require('fs');
const discord = require('discord.js');
const discordmodals = require('discord-modals')

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
    data: {customid: 'setting-timeoutLogCh', type: 'BUTTON'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const modal = new discordmodals.Modal()
			.setCustomId('modal-setting-timeoutLogCh')
			.setTitle('設定 - /timeout')
			.addComponents(
            new discordmodals.TextInputComponent()
                .setCustomId('textinput')
                .setLabel('タイムアウトコマンドのログを送信するチャンネルの名前を入力してください。')
                .setStyle('SHORT')
                .setMaxLength(100)
                .setRequired(true)
			);  
		discordmodals.showModal(modal, {client, interaction});
    }
}