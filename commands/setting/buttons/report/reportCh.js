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
    data: { customid: 'setting-reportCh', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
		const modal = new discord.Modal()
			.setCustomId('setting-Channel')
			.setTitle(language('Setting.Report.Modal.ReportCh.Title'))
			.addComponents(
				new discord.MessageActionRow().addComponents(
					new discord.TextInputComponent()
						.setCustomId('reportCh')
						.setLabel(language('Setting.Report.Modal.ReportCh.Label'))
						.setStyle('SHORT')
						.setMaxLength(100)
						.setRequired(true),
				),
			);
		interaction.showModal(modal);
    },
};