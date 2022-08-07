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
    exec: async (client, interaction, Configs, language) => {
		const modal = new discord.Modal()
			.setCustomId('setting-Channel')
			.setTitle(language('Setting.WelcomeMessage.Modal.WelcomeCh.Title'))
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('welcomeCh')
						.setLabel(language('Setting.WelcomeMessage.Modal.WelcomeCh.Label'))
						.setStyle('SHORT')
						.setMaxLength(100)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};