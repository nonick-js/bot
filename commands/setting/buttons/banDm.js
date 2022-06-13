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
    data: { customid: 'setting-banDm', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const banDm = config.get('banDm');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        if (banDm) {
            Configs.update({ banDm: false }, { where: { serverId: interaction.guild.id } });
            embed.spliceFields(1, 1, { name: 'DM警告機能', value: `${discord.Formatters.formatEmoji('758380151238033419')}無効化中`, inline:true });
            button.components[1]
                .setLabel('有効化')
                .setStyle('SUCCESS');
        } else {
            Configs.update({ banDm: true }, { where: { serverId: interaction.guild.id } });
            embed.spliceFields(1, 1, { name: 'DM警告機能', value: `${discord.Formatters.formatEmoji('758380151544217670')}有効化中`, inline:true });
            button.components[1]
                .setLabel('無効化')
                .setStyle('DANGER');
        }
        interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
    },
};