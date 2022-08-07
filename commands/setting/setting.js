const discord = require('discord.js');

/**
 * @callback InteractionCallback
 * @param {discord.Client} client
 * @param {discord.MessageContextMenuInteraction} interaction
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
                .setDescription(language('Setting.Error.Permission'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.MessageEmbed()
            .setTitle(language('Setting.Home.Embed.Title', client.user.username))
            .setDescription(language('Setting.Home.Embed.Description', client.user.username))
            .setColor('2f3136');

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
                    { label: `${language('Setting.Home.Select.Option.Label_1')}`, value: 'setting-welcomemessage', emoji: '🚪' },
                    { label: `${language('Setting.Home.Select.Option.Label_2')}`, value: 'setting-report', emoji: '📢' },
                    { label: `${language('Setting.Home.Select.Option.Label_3')}`, value: 'setting-linkOpen', emoji: '🔗' },
                ]),
        );

        interaction.reply({ embeds: [embed], components: [select, button], ephemeral: true });
    },
};