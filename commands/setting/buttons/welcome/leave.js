// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const swicher = require('../../../../modules/swicher');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type { discord.ApplicationCommandData|ContextMenuData } */
    data: { customid: 'setting-leave', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { leave, leaveCh } = config.get();

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        Configs.update({ leave: leave ? false : true }, { where: { serverId: interaction.guildId } });
        embed.fields[1].value = swicher.chStatusSwicher(!leave, leaveCh);
        button.components[1]
            .setLabel(swicher.buttonLabelSwicher(!leave))
            .setStyle(swicher.buttonStyleSwicher(!leave));
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};