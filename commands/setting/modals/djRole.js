const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ModalSubmitInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-djRole', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const dj = config.get('dj');
        const textInput = interaction.fields.getTextInputValue('textinput');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        try {
            const roleId = interaction.guild.roles.cache.find((role) => role.name === textInput).id;
            Configs.update({ djRole: roleId }, { where: { serverId: interaction.guildId } });
            button.components[1].setDisabled(false);
            if (dj) embed.fields[0].value = language('SETTING_ROLE_ENABLE', roleId);
            interaction.update({ embeds: [embed], components: [select, button] });
        }
        catch {
            const roleNotFound = new discord.MessageEmbed()
                .setTitle(language('SETTING_ERROR_TITLE'))
                .setDescription(language('SETTING_ERROR_ROLENOTFOUND', textInput))
                .setColor('RED');
            interaction.update({ embeds: [embed, roleNotFound] });
        }
    },
};