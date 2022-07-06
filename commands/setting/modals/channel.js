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
    data: { customid: 'setting-Channel', type: 'MODAL' },
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

        const name = embed.fields[parseInt(settingInfo[1], 10)].name;
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const configCh = config.get(settingInfo[0].slice(0, -2));

        try {
            const channel = interaction.guild.channels.cache.find(v => v.name === textInput);
            const successembed = new discord.MessageEmbed()
                .setDescription(language('SETTING_CH_SUCCESS_DESCRIPTION', name))
                .setColor('GREEN');
            channel.send({ embeds: [successembed] })
                .then(() => {
                    Configs.update({ [settingInfo[0]]: channel.id }, { where: { serverId: interaction.guildId } });
                    if (settingInfo[0].slice(0, -2) == 'report') {
                        embed.fields[parseInt(settingInfo[1], 10)] = { name: name, value: `${discord.Formatters.channelMention(channel.id)}`, inline:true };
                    } else {
                        if (configCh) embed.fields[parseInt(settingInfo[1], 10)] = { name: `${language('SETTING_CHANNEL_ENABLE', channel.id)}`, inline: true };
                        button.components[1].setDisabled(false);
                    }
                    interaction.update({ embeds: [embed], components: [select, button] });
                })
                .catch(() => {
                    const MissingPermission = new discord.MessageEmbed()
                        .setTitle(language('SETTING_ERROR_TITLE'))
                        .setDescription(language('SETTING_ERROR_NOTPERMISSION'))
                        .setColor('RED');
                    interaction.update({ embeds: [embed, MissingPermission], components: [select, button] });
                });
        }
        catch {
            const notFound = new discord.MessageEmbed()
                .setTitle(language('SETTING_ERROR_TITLE'))
                .setDescription(language('SETTING_ERROR_CHANNELNOTFOUND', textInput))
                .setColor('RED');
            interaction.update({ embeds: [embed, notFound] });
        }
    },
};