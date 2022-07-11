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
    data: { customid: 'reactionRole-Send', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        if (select.components[0].type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription(language('REACTION_DELETEROLE_ERROR'))
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (interaction.message.components[1].components[3].style == 'DANGER') select.components[0].setMaxValues(select.components[0].options.length);
        interaction.channel.send({ embeds: [embed], components: [select] })
            .then(() => {
                const success = new discord.MessageEmbed()
                    .setDescription(language('REACTION_SEND_SUCCESS'))
                    .setColor('GREEN');
                interaction.update({ content: ' ', embeds: [success], components:[] });
            })
            .catch(() => {
                const error = new discord.MessageEmbed()
                    .setDescription(language('REACTION_SEND_ERROR'))
                    .setColor('RED');
                interaction.update({ embeds: [embed, error] });
            });
    },
};