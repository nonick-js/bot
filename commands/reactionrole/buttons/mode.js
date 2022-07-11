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
    data: { customid: 'reactionRole-Mode', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        if (select.components[0].type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription(language('REACTION_MODE_ERROR'))
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (button.components[3].label == language('REACTION_BUTTON_4_SINGLE')) {
            button.components[3].label = language('REACTION_BUTTON_4_MULTI');
            button.components[3].style = 'DANGER';
        } else {
            button.components[3].label = language('REACTION_BUTTON_4_SINGLE');
            button.components[3].style = 'SUCCESS';
        }
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};