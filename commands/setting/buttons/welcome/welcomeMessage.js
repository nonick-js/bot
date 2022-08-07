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
			.setTitle(language('Setting.WelcomeMessage.Modal.WelcomeMessage.Title'))
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('welcomeMessage')
						.setLabel(language('Setting.WelcomeMessage.Modal.WelcomeMessage.Label'))
						.setStyle('PARAGRAPH')
						.setPlaceholder(language('Setting.WelcomeMessage.Modal.WelcomeMessage.Placeholder'))
						.setMaxLength(1000)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};