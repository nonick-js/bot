const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.SelectMenuInteraction} interaction
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
    data: { customid: 'language', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {
        await Configs.update({ language: interaction.values[0] }, { where: { serverId: interaction.guild.id } });
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const new_language = require(`../../../language/${config.get('language')}`);

        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        const embed = new discord.MessageEmbed()
            .setTitle(new_language('SETTING_LANGUAGE_TITLE'))
            .setDescription(new_language('SETTING_LANGUAGE_DESCRIPTION'))
            .setColor('GREEN');

        for (let i = 0; i < select.components[0].options.length; i++) {
            select.components[0].options[i].default = false;
        }
        const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
        select.components[0].options[index].default = true;
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};