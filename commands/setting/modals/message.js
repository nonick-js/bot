// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.CommandInteraction} interaction
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
    data: { customid: 'modal-setting-welcomeMessage', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const string = interaction.fields.getTextInputValue('firstTextInput');
        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];

        Configs.update({ welcomeMessage: `${string}` }, { where: { serverId: interaction.guildId } });
        embed.fields[2] = { name: `${language('SETTING_WELCOMEMESSAGE_FIELD_3')}`, value: `${string}` };
        interaction.update({ embeds: [embed] });
    },
};