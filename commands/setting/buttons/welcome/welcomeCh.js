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
    data: { customid: 'setting-welcomeCh', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
		const modal = new discord.Modal()
			.setCustomId('setting-Channel')
			.setTitle('入室ログ')
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('welcomeCh')
						.setLabel('チャンネル名')
						.setStyle('SHORT')
						.setMaxLength(100)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};