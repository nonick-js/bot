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
    data: { customid: 'userReport', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const modal = new discord.Modal()
            .setCustomId('userReport')
            .setTitle('メンバーを通報')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('firstTextInput')
                        .setLabel('このユーザーを通報する理由を入力してください。')
                        .setPlaceholder('できる限り詳しく入力してください')
                        .setStyle('PARAGRAPH')
                        .setMaxLength(1000)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};