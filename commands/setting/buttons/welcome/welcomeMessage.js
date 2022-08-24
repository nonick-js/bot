const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
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
    exec: async (client, interaction) => {
		const modal = new discord.Modal()
			.setCustomId('modal-setting-welcomeMessage')
			.setTitle('Welcomeメッセージ')
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('welcomeMessage')
						.setLabel('メッセージ')
						.setStyle('PARAGRAPH')
						.setPlaceholder('<#チャンネルID>や<@ユーザーID>、<@&ロールID> と入力することでそれぞれメンションが可能です')
						.setMaxLength(1000)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};