const discord = require('discord.js');
const discordmodal = require('discord-modals');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: "report", type: "BUTTON"},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
		const modal = new discordmodal.Modal()
			.setCustomId('reportModal')
			.setTitle('あと1ステップです')
			.addComponents(
                new discordmodal.TextInputComponent()
                    .setCustomId('textinput')
                    .setLabel('このメッセージはサーバールールの何に違反していますか?')
                    .setPlaceholder('できる限り詳しく入力してください。')
                    .setStyle('LONG')
                    .setRequired(true)
            );
		discordmodal.showModal(modal, {client, interaction});
    }
}