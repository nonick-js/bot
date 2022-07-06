const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ButtonInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-language', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const embed = new discord.MessageEmbed()
            .setTitle(language('SETTING_LANGUAGE_TITLE'))
            .setDescription(language('SETTING_LANGUAGE_DESCRIPTION'))
            .setColor('GREEN');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle('PRIMARY'),
        );
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('language')
                .setOptions([
                    { label: '日本語', value: 'ja_JP', emoji: '🇯🇵', default: config.get('language') == 'ja_JP' ? true : false },
                    { label: 'English, US', value: 'en_US', description: 'Translation may not be 100% accurate.', emoji: '🇺🇸', default: config.get('language') == 'en_US' ? true : false },
                ]),
        );
        interaction.update({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};