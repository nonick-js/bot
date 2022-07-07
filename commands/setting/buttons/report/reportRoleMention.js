// eslint-disable-next-line no-unused-vars
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
    data: { customid: 'setting-reportRoleMention', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention } = config.get();

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        if (reportRoleMention) {
            Configs.update({ reportRoleMention: false }, { where: { serverId: interaction.guildId } });
            embed.fields[1].value = language('SETTING_DISABLE');
            button.components[1]
                .setLabel(language('SETTING_BUTTON_ENABLE'))
                .setStyle('SUCCESS');
        } else {
            Configs.update({ reportRoleMention: true }, { where: { serverId: interaction.guildId } });
            embed.fields[1].value = language('SETTING_ROLE_ENABLE', reportRole);
            button.components[1]
                .setLabel(language('SETTING_BUTTON_DISABLE'))
                .setStyle('DANGER');
        }
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};