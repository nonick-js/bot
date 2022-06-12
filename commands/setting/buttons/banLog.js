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
    data: { customid: 'setting-banLog', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const banLog = config.get('banLog');
        const banLogCh = config.get('banLogCh');

        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        if (banLog) {
            Configs.update({ banLog: false }, { where: { serverId: interaction.guild.id } });
            embed.spliceFields(0, 1, { name: 'ログ機能', value: `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline:true });
            button.components[1]
                .setLabel('有効化')
                .setStyle('SUCCESS');
        } else {
            Configs.update({ banLog: true }, { where: { serverId: interaction.guild.id } });
            embed.spliceFields(0, 1, { name: 'ログ機能', value: `${discord.Formatters.formatEmoji('758380151544217670')}有効 (${discord.Formatters.channelMention(banLogCh)})`, inline:true });
            button.components[1]
                .setLabel('無効化')
                .setStyle('DANGER');
        }
        interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
    },
};