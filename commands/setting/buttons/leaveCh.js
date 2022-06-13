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
    data:  { customid: 'setting-leaveCh', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
		const modal = new discord.Modal()
			.setCustomId('setting-Channel')
			.setTitle('退室ログ')
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('leaveCh,1')
						.setLabel('退室ログを送信するチャンネルの名前を入力してください。')
						.setStyle('SHORT')
						.setMaxLength(100)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
	},
};