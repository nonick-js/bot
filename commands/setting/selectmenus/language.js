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
        await Configs.update({ laungage: interaction.values[0] }, { where: { serverId: interaction.guild.id } });
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const new_laungage = require(`../../../language/${config.get('laungage')}`);

        const embed = new discord.MessageEmbed()
            .setDescription(new_laungage('SETTING_NEW_LANGUAGE'))
            .setColor('BLUE');
        interaction.update({ embeds: [embed] });
    },
};