const discord = require('discord.js');
const discordmodals = require('discord-modals');

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
    data: {customid: 'setting-welcomeMessage', type: 'BUTTON'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const modal = new discordmodals.Modal()
			.setCustomId('modal-setting-welcomeMessage')
			.setTitle('設定 - 入退室ログ')
			.addComponents(
			new discordmodals.TextInputComponent()
				.setCustomId('textinput')
				.setLabel('入室時埋め込みに表示するメッセージを入力してください。')
				.setStyle('LONG')
				.setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
				.setRequired(true)
			);
		discordmodals.showModal(modal, {client, interaction});
    }
}