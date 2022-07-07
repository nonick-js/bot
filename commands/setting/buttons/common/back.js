const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-back', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = new discord.MessageEmbed()
            .setTitle(language('SETTING_HOME_TITLE', client.user.username))
            .setDescription(language('SETTING_HOME_DESCRIPTION', client.user.username))
            .setColor('GREEN');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-whatsnew')
                .setLabel('What\'s New')
                .setEmoji('966588719643631666')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('setting-language')
                .setEmoji('🌐')
                .setStyle('SECONDARY'),
        );
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('setting-select')
                .addOptions([
                    { label: `${language('SETTING_WELCOMEMESSAGE')}`, value: 'setting-welcomemessage', emoji: '🚪' },
                    { label: `${language('SETTING_REPORT')}`, value: 'setting-report', emoji: '📢' },
                    { label: `${language('SETTING_MESSAGELINKEXPANSION')}`, value: 'setting-linkOpen', emoji: '🔗' },
                    { label: `${language('SETTING_MUSIC')}`, value: 'setting-music', emoji: '🎵' },
                ]),
        );
        interaction.update({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};