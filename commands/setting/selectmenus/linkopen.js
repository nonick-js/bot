const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.SelectMenuInteraction} interaction
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
    data: { customid: 'banSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        if (interaction.values == 'setting-linkOpen-1') {
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};