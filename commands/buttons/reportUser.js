const fs = require('fs');
const discord = require('discord.js');
const discordmodal = require('discord-modals');

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
    data: {customid: 'reportUser', type: 'BUTTON'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const modal = new discordmodal.Modal()
			.setCustomId('modal-reportUser')
			.setTitle('メンバーを通報')
			.addComponents(
                new discordmodal.TextInputComponent()
                    .setCustomId('textinput')
                    .setLabel('このユーザーを通報する理由を入力してください。')
                    .setPlaceholder('できる限り詳しく入力してください。')
                    .setStyle('LONG')
                    .setMaxLength(1000)
                    .setRequired(true)
            );
		discordmodal.showModal(modal, {client, interaction});
    }
}