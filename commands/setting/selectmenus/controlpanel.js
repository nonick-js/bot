const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.SelectMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-select', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-welcomemessage') {
            const { welcome, welcomeCh, welcomeMessage, leave, leaveCh } = config.get();
            const embed = new discord.MessageEmbed()
                .setTitle(language('SETTING_WELCOMEMESSAGE_EMBED_TITLE'))
                .setDescription(language('SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION'))
                .setColor('GREEN')
                .addFields(
                    { name: `${language('SETTING_WELCOMEMESSAGE_EMBED_FIELD_1')}`, value: welcome ? `${language('SETTING_CHANNEL_ENABLE', welcomeCh)}` : `${language('SETTING_DISABLE')}`, inline:true },
                    { name: `${language('SETTING_WELCOMEMESSAGE_EMBED_FIELD_2')}`, value: leave ? `${language('SETTING_CHANNEL_ENABLE', leaveCh)}` : `${language('SETTING_DISABLE')}`, inline:true },
                    { name: `${language('SETTING_WELCOMEMESSAGE_EMBED_FIELD_3')}`, value: welcomeMessage || 'SETTING_NONE' },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('welcomeSetting')
                    .addOptions([
                        { label: `${language('SETTING_WELCOMEMESSAGE_SELECT_TITLE_1')}`, value: 'setting-welcome-1', description: `${language('SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_1')}`, emoji: '966588719635267624', default: true },
                        { label: `${language('SETTING_WELCOMEMESSAGE_SELECT_TITLE_2')}`, value: 'setting-welcome-2', description: `${language('SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_2')}`, emoji: '966588719635267624' },
                    ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(welcome ? language('SETTING_BUTTON_DISABLE') : language('SETTING_BUTTON_ENABLE'))
                    .setStyle(welcome ? 'DANGER' : 'SUCCESS')
                    .setDisabled(welcomeCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel(language('SETTING_BUTTON_CH'))
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel(language('SETTING_BUTTON_MESSAGE'))
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-report') {
            const { reportCh, reportRoleMention, reportRole } = config.get();
            const embed = new discord.MessageEmbed()
                .setTitle(language('SETTING_REPORT_EMBED_TITLE'))
                .setDescription(language('SETTING_REPORT_EMBED_DESCRIPTION'))
                .setColor('GREEN')
                .addFields(
                    { name: `${language('SETTING_REPORT_EMBED_FIELD_1')}`, value: reportCh ? `${language('SETTING_CHANNEL_ENABLE', reportCh)}` : `${language('SETTING_NONE')}`, inline: true },
                    { name: `${language('SETTING_REPORT_EMBED_FIELD_2')}`, value: reportRoleMention ? `${language('SETTING_ROLE_ENABLE', reportRole)})` : `${language('SETTING_DISABLE')}`, inline: true },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .addOptions([
                    { label: `${language('SETTING_REPORT_SELECT_TITLE_1')}`, value: 'setting-report-1', emoji: '🌐', default: true },
                    { label: `${language('SETTING_REPORT_SELECT_TITLE_2')}`, description: `${language('SETTING_REPORT_SELECT_DESCRIPTION_2')}`, value: 'setting-report-2', emoji: '966719258430160986' },
                ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel(language('SETTING_BUTTON_CH'))
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-linkOpen') {
            const linkOpen = config.get('linkOpen');
            const embed = new discord.MessageEmbed()
                .setTitle(language('SETTING_MESSAGELINKEXPANSION_EMBED_TITLE'))
                .setDescription(language('SETTING_MESSAGELINKEXPANSION_EMBED_DESCRIPTION'))
                .setColor('GREEN')
                .addFields({ name: language('SETTING_MESSAGELINKEXPANSION_EMBED_FIELD_1'), value: linkOpen ? `${language('SETTING_ENABLE')}` : `${language('SETTING_DISABLE')}`, inline: true });
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('linkOpenSetting')
                    .addOptions({ label: `${language('SETTING_MESSAGELINKEXPANSION_SELECT_TITLE_1')}`, value: 'setting-linkOpen-1', emoji: '966588719635267624', default:true }),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-linkOpen')
                    .setLabel(linkOpen ? language('SETTING_BUTTON_DISABLE') : language('SETTING_BUTTON_ENABLE'))
                    .setStyle(linkOpen ? 'DANGER' : 'SUCCESS'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-music') {
            const { dj, djRole } = config.get();

            const embed = new discord.MessageEmbed()
            .setTitle('🛠 設定 - 音楽再生')
            .setDescription([
                'musicコマンドの設定を以下のセレクトメニューから行えます。',
                discord.Formatters.codeBlock('markdown', [
                    '# musicコマンドとは...',
                    'YoutubeやSpotify、SoundCloudにある音楽をVCで再生することができます。',
                    'ボイスチャット内で音楽を再生させたい時に便利です。',
                ].join('\n')),
                '**【現在の設定】**',
            ].join('\n'))
            .setColor('GREEN')
            .addFields(
                { name: 'DJモード', value: dj ? `${discord.Formatters.formatEmoji('968351750014783532')}有効 (${discord.Formatters.roleMention(djRole)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true },
                { name: '❓DJモードとは', value: 'musicコマンドや再生パネルの使用を、指定したロールを持つメンバーと管理者権限をもつメンバーのみ許可します。\n大規模なサーバーで使用する場合やVC荒らしを防止するために、**この設定を有効にすることをおすすめします。**', inline: true },
            );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('musicSetting')
                    .setPlaceholder('ここから選択')
                    .addOptions({ label: 'DJモード', value: 'setting-music', emoji: '966719258430160986', default:true }),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-dj')
                    .setLabel(dj ? '無効化' : '有効化')
                    .setStyle(dj ? 'DANGER' : 'SUCCESS')
                    .setDisabled(djRole ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-djRole')
                    .setLabel('ロールの変更')
                    .setEmoji('966719258430160986')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral: true });
        }
    },
};