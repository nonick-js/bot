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
    data: {customid: 'setting-welcomeCh', type: 'BUTTON'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const modal = new discordmodals.Modal()
			.setCustomId('modal-setting-welcomeCh')
			.setTitle('設定 - 入退室ログ')
			.addComponents(
			new discordmodals.TextInputComponent()
				.setCustomId('textinput')
				.setLabel('入退室ログを送信するチャンネルの名前を入力してください。')
				.setStyle('SHORT')
				.setMaxLength(100)
				.setRequired(true)
			);  
		discordmodals.showModal(modal, {client, interaction});
    }
}