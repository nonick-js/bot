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
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-linkOpen', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const linkOpen = config.get('linkOpen');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        if (linkOpen) {
            Configs.update({ linkOpen: false }, { where: { serverId: interaction.guildId } });
            embed.spliceFields(0, 1, { name: 'リンク展開', value: `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline:true });
            button.components[1]
                .setLabel('有効化')
                .setStyle('SUCCESS');
        }
        else {
            Configs.update({ linkOpen: true }, { where: { serverId: interaction.guildId } });
            embed.spliceFields(0, 1, { name: 'リンク展開', value: `${discord.Formatters.formatEmoji('758380151544217670')}有効`, inline:true });
            button.components[1]
                .setLabel('無効化')
                .setStyle('DANGER');
        }
        interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
    },
};