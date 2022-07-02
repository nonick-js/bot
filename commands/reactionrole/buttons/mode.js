const discord = require('discord.js');

/**
* @callback InteractionCallback
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
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        if (select.components[0].type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription('❌ まずはロールを追加してください!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (button.components[3].label == '単一選択') {
            button.components[3]
                .setLabel('複数選択');
        } else {
            button.components[3]
                .setLabel('単一選択');
        }
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};