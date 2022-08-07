// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const swicher = require('../../../modules/swicher');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-linkOpen', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const linkOpen = config.get('linkOpen');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        Configs.update({ linkOpen: linkOpen ? false : true }, { where: { serverId: interaction.guildId } });
        embed.fields[0].value = swicher.statusSwicher(language, linkOpen);
        button.components[1]
            .setLabel(swicher.buttonLabelSwicher(language, !linkOpen))
            .setStyle(swicher.buttonStyleSwicher(!linkOpen));
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};