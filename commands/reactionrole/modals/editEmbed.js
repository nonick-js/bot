const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client}
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'reactionRole-update', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        const imageURL = interaction.fields.getTextInputValue('image');
        const embed = new discord.MessageEmbed()
            .setTitle(interaction.fields.getTextInputValue('title'))
            .setDescription(interaction.fields.getTextInputValue('description'))
            .setColor('516ff5');
        if (imageURL) {
            if (imageURL.startsWith('http://') || imageURL.startsWith('https://')) {
                embed.setImage(imageURL);
            }
        }
        interaction.update({ embeds: [embed], ephemeral: true });
    },
};