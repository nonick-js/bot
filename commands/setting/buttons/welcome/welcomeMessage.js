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
    data: { customid: 'setting-welcomeMessage', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
		const modal = new discord.Modal()
			.setCustomId('modal-setting-welcomeMessage')
			.setTitle('Welcomeメッセージ')
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('firstTextInput')
						.setLabel('入室ログに表示するメッセージを入力してください。')
						.setStyle('PARAGRAPH')
						.setPlaceholder('<#チャンネルID>や<@ユーザーID>、<@&ロールID> と入力することでそれぞれメンションが可能です!')
						.setMaxLength(1000)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};