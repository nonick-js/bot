const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
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
    data: { customid: 'setting-Role', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        /** @type {Array} 設定する項目 splice位置 */
        const settingInfo = interaction.components[0].components[0].customId.split(',');
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const configMention = config.get(settingInfo[0] + 'Mention');

        try {
            const roleId = interaction.guild.roles.cache.find((role) => role.name === textInput).id;
            Configs.update({ [settingInfo[0]]: roleId }, { where: { serverId: interaction.guildId } });
            button.components[1].setDisabled(false);
            if (configMention) embed.fields[parseInt(settingInfo[1], 10)].value = language('SETTING_ROLE_ENABLE', roleId);
            interaction.update({ embeds: [embed], components: [select, button] });
        }
        catch {
            const roleNotFound = new discord.MessageEmbed()
                .setTitle(language('SETTING_ERROR_TITLE'))
                .setDescription(language('SETTING_ERROR_ROLENOTFOUND', textInput))
                .setColor('RED');
            interaction.update({ embeds: [embed, roleNotFound], components: [select, button] });
        }
    },
};