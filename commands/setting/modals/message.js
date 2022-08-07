// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const fieldIndex = {
    welcomeMessage: 2,
};

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.CommandInteraction} interaction
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
    exec: async (client, interaction, Configs) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];

        Configs.update({ [setting]: `${textInput}` }, { where: { serverId: interaction.guildId } });
        embed.fields[fieldIndex[setting]].value = textInput;
        interaction.update({ embeds: [embed] });
    },
};