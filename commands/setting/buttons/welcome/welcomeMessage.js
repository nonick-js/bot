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
    exec: async (client, interaction, Configs, language) => {
		const modal = new discord.Modal()
			.setCustomId('modal-setting-welcomeMessage')
			.setTitle(language('SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_TITLE'))
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('firstTextInput')
						.setLabel(language('SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_LABEL'))
						.setStyle('PARAGRAPH')
						.setPlaceholder(language('SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_PLACEHOLDER'))
						.setMaxLength(1000)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};