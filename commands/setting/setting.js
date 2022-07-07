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
 * @prop {"BUTTON"|"SELECT_MENU"} type
 */

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'setting', description: 'BOTのコントロールパネル(設定)を開きます', descriptionLocalizations: { 'en-US': 'Open the BOT\'s control panel (settings)' }, type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('SETTING.PERMISSION_ERROR'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

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
        interaction.reply({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};