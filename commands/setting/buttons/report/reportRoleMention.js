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
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-reportRoleMention', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention } = config.get();

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        Configs.update({ reportRoleMention: reportRoleMention ? false : true }, { where: { serverId: interaction.guildId } });
        embed.fields[1].value = swicher.roleStatusSwicher(!reportRoleMention, reportRole);
        button.components[1]
            .setLabel(swicher.buttonLabelSwicher(!reportRoleMention))
            .setStyle(swicher.buttonStyleSwicher(!reportRoleMention));
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};