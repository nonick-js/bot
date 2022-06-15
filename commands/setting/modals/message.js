/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
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
    exec: async (interaction, client, Configs) => {
        const string = interaction.fields.getTextInputValue('firstTextInput');
        const embed = interaction.message.embeds[0];

        Configs.update({ welcomeMessage: `${string}` }, { where: { serverId: interaction.guild.id } });
        embed.spliceFields(2, 1, { name: 'メッセージ', value: `${string}` });
        interaction.update({ embeds: [embed], ephemeral: true });
    },
};