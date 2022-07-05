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
        const embed = new discord.MessageEmbed()
            .setDescription(language('SETTING_LANGUAGE'))
            .setColor('BLUE');
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('language')
                .setOptions([
                    { label: '日本語', value: 'ja_JP', emoji: '🇯🇵' },
                    { label: 'English, US', value: 'en_US', description: 'Translation may not be 100% accurate.', emoji: '🇺🇸' },
                ]),
        );
        interaction.reply({ embeds: [embed], components: [select], ephemeral: true });
    },
};