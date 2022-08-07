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
    data: { customid: 'setting-welcome', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { welcome, welcomeCh } = config.get();

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        Configs.update({ welcome: welcome ? false : true }, { where: { serverId: interaction.guildId } });
        embed.fields[0].value = swicher.chStatusSwicher(language, !welcome, welcomeCh);
        button.components[1]
            .setLabel(swicher.buttonLabelSwicher(language, !welcome))
            .setStyle(swicher.buttonStyleSwicher(!welcome));
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};