const discord = require('discord.js');

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
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'messageReport', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const modal = new discord.Modal()
            .setCustomId('messageReport')
            .setTitle('メッセージを通報')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('firstTextInput')
                        .setLabel('このメッセージはサーバールール等の何に違反していますか？')
                        .setPlaceholder('できる限り詳しく入力してください')
                        .setStyle('PARAGRAPH')
                        .setMaxLength(1000)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};