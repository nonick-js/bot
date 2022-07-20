const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.SelectMenuInteraction} interaction
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
    data: { customid: 'setting-select', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
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
                .setTitle('🛠 設定 - 入退室ログ')
                .setDescription([
                    '入退室ログの設定を以下のボタンから行えます。',
                    discord.Formatters.codeBlock('markdown', '#入退室ログとは...\nサーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。'),
                    '**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields(
                    { name: '入室ログ', value: welcome ? `${discord.Formatters.formatEmoji('758380151544217670')}有効 (${discord.Formatters.channelMention(welcomeCh)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline:true },
                    { name: '退室ログ', value: leave ? `${discord.Formatters.formatEmoji('758380151544217670')}有効 (${discord.Formatters.channelMention(leaveCh)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline:true },
                    { name: '入室ログメッセージ', value: welcomeMessage || '設定されていません' },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('welcomeSetting')
                    .addOptions([
                        { label: '入室ログ', value: 'setting-welcome-1', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true },
                        { label: '退室ログ', value: 'setting-welcome-2', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' },
                    ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(welcome ? '無効化' : '有効化')
                    .setStyle(welcome ? 'DANGER' : 'SUCCESS')
                    .setDisabled(welcomeCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel('メッセージ')
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-report') {
            const { reportCh, reportRoleMention, reportRole } = config.get();
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - 通報機能')
                .setDescription([
                    '通報機能の設定を以下のセレクトメニューから行えます。',
                    '`Tips:`コンテキストメニュー自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。',
                    discord.Formatters.codeBlock('markdown', '#通報機能とは...\nメンバーがサーバールール等に違反しているメッセージを通報できる機能です。モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。'),
                    '**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields(
                    { name: '通報の送信先', value: reportCh == null ? '指定されていません' : `${discord.Formatters.channelMention(reportCh)}`, inline: true },
                    { name: 'ロールメンション', value: reportRoleMention ? `${discord.Formatters.formatEmoji('968351750014783532')}有効 (${discord.Formatters.roleMention(reportRole)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true },
                );
            const select1 = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: '全般設定', value: 'setting-report-1', emoji: '🌐', default: true },
                    { label: 'ロールメンション機能', description: '通報受け取り時にロールをメンション', value: 'setting-report-2', emoji: '966719258430160986' },
                ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel('通報の送信先')
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            ]);
            interaction.update({ embeds: [embed], components: [select1, button], ephemeral:true });
        }

        if (interaction.values == 'setting-timeout') {
            const { timeoutLog, timeoutLogCh, timeoutDm } = config.get();
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - timeoutコマンド')
                .setDescription([
                    'timeoutコマンドの設定を以下のセレクトメニューから行えます。',
                    '`Tips:`スラッシュコマンド自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。',
                    discord.Formatters.codeBlock('markdown', '#timeoutコマンドとは...\nサーバーにいるメンバーにタイムアウト(ミュート)を設定させるコマンドです。公式の機能より細かく設定させることができ、一分単位での調整が可能です。'),
                    '**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields(
                    { name: 'ログ機能', value: timeoutLog ? `${discord.Formatters.formatEmoji('968351750014783532')}有効 (${discord.Formatters.channelMention(timeoutLogCh)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true },
                    { name: 'DM警告機能', value: timeoutDm ? `${discord.Formatters.formatEmoji('968351750014783532')}有効` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('timeoutSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-timeout-1', emoji: '966588719635267624', default: true },
                    { label: 'DM警告機能', description: 'タイムアウトされた人に警告DMを送信', value: 'setting-timeout-2', emoji: '966588719635267624' },
                ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-timeoutLog')
                    .setLabel(timeoutLog ? '無効化' : '有効化')
                    .setStyle(timeoutLog ? 'DANGER' : 'SUCCESS')
                    .setDisabled(timeoutLogCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-timeoutLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-ban') {
            const { banLog, banLogCh, banDm } = config.get();
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - banコマンド')
                .setDescription([
                    'banコマンドの設定を以下のセレクトメニューから行えます。',
                    '`Tips:`スラッシュコマンド自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。',
                    discord.Formatters.codeBlock('markdown', '#BANコマンドとは...\n公式のBANコマンドを強化したコマンドです。\nサーバーにいないユーザーをIDのみでBANすることもできます。荒らしをして抜けていったメンバーの追加処分や、他コミュニティで荒らしをしたユーザーの対策に有効です。'),
                    '**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields(
                    { name: 'ログ機能', value: banLog ? `${discord.Formatters.formatEmoji('968351750014783532')}有効 (${discord.Formatters.channelMention(banLogCh)})` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true },
                    { name: 'DM警告機能', value: banDm ? `${discord.Formatters.formatEmoji('968351750014783532')}有効` : `${discord.Formatters.formatEmoji('758380151238033419')} 無効`, inline: true },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('banSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'ログ機能', description: 'コマンドの実行ログを送信', value: 'setting-ban-1', emoji: '966588719635267624', default:true },
                    { label: 'DM警告機能', description: 'BANされた人に警告DMを送信', value: 'setting-ban-2', emoji: '966588719635267624' },
                ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-banLog')
                    .setLabel(banLog ? '無効化' : '有効化')
                    .setStyle(banLog ? 'DANGER' : 'SUCCESS')
                    .setDisabled(banLogCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-banLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-linkOpen') {
            const linkOpen = config.get('linkOpen');
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - リンク展開')
                .setDescription([
                    'リンク展開の設定を以下のセレクトメニューから行えます。',
                    discord.Formatters.codeBlock('markdown', '#リンク展開とは...\nDiscordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。\n流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。'),
                    '**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields({ name: 'リンク展開', value: linkOpen ? `${discord.Formatters.formatEmoji('968351750014783532')}有効` : `${discord.Formatters.formatEmoji('758380151238033419')}無効`, inline: true });
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('linkOpenSetting')
                    .setPlaceholder('ここから選択')
                    .addOptions({ label: '全般設定', value: 'setting-linkOpen-1', emoji: '966588719635267624', default:true }),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-linkOpen')
                    .setLabel(linkOpen ? '無効化' : '有効化')
                    .setStyle(linkOpen ? 'DANGER' : 'SUCCESS'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};