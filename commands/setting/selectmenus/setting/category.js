const discord = require('discord.js');
const { settingSwicher } = require('../../../../modules/swicher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-categorySelect',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const logConfig = await interaction.db_logConfig.findOne({ where: { serverId: interaction.guildId } });
        const verificationConfig = await interaction.db_verificationConfig.findOne({ where: { serverId: interaction.guildId } });

        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle(discord.ButtonStyle.Primary),
        );

        if (interaction.values == 'setting-welcomeMessage') {
            const { welcome, welcomeCh, welcomeMessage, leave, leaveCh } = config.get();

            const embed = new discord.EmbedBuilder()
                .setTitle('🛠 設定 - 入退室ログ機能')
                .setDescription([
                    '```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。',
                    'メッセージを設定することで参加した人に見てもらいたい情報を送信できます。```\n**【現在の設定】**',
                ].join(''))
                .setColor('Green')
                .addFields(
                    { name: '入室ログ', value: settingSwicher('STATUS_CH', welcome, welcomeCh), inline:true },
                    { name: '退室ログ', value: settingSwicher('STATUS_CH', leave, leaveCh), inline:true },
                    { name: '入室ログメッセージ', value: welcomeMessage ?? '__設定されていません (why)__' },
                );
            const select = new discord.ActionRowBuilder().addComponents([
                new discord.SelectMenuBuilder()
                    .setCustomId('welcomeMessageSetting')
                    .addOptions(
                        { label: '入室ログ', value: 'setting-welcome-1', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true },
                        { label: '退室ログ', value: 'setting-welcome-2', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' },
                    ),
            ]);
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-welcome')
                    .setLabel(settingSwicher('BUTTON_LABEL', welcome))
                    .setStyle(settingSwicher('BUTTON_STYLE', welcome))
                    .setDisabled(settingSwicher('BUTTON_DISABLE', welcomeCh)),
                new discord.ButtonBuilder()
                    .setCustomId('setting-welcomeCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle(discord.ButtonStyle.Secondary),
                new discord.ButtonBuilder()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel('メッセージ')
                    .setEmoji('966596708458983484')
                    .setStyle(discord.ButtonStyle.Secondary),
            );

            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-report') {
            const { reportCh, reportRoleMention, reportRole } = config.get();

            const embed = new discord.EmbedBuilder()
                .setTitle('🛠 設定 - 通報機能')
                .setDescription([
                    '**Tips**: コンテキストメニュー自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。',
                    '```メンバーがサーバールール等に違反しているメッセージを通報できる機能です。',
                    'モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。```\n**【現在の設定】**',
                ].join(''))
                .setColor('Green')
                .addFields(
                    { name: '通報の送信先', value: reportCh ? `<#${reportCh}>` : `${'__設定されていません__'}`, inline: true },
                    { name: 'ロールメンション', value: settingSwicher('STATUS_ROLE', reportRoleMention, reportRole), inline: true },
                );
            const select = new discord.ActionRowBuilder().addComponents([
                new discord.SelectMenuBuilder()
                .setCustomId('reportSetting')
                .addOptions([
                    { label: '全般設定', value: 'setting-report-1', emoji: '🌐', default: true },
                    { label: 'ロールメンション機能', description: '通報受け取り時にロールをメンション', value: 'setting-report-2', emoji: '966719258430160986' },
                ]),
            ]);
            button.addComponents([
                new discord.ButtonBuilder()
                    .setCustomId('setting-reportCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle(discord.ButtonStyle.Secondary),
            ]);

            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-linkOpen') {
            const linkOpen = config.get('linkOpen');

            const embed = new discord.EmbedBuilder()
                .setTitle('🛠 設定 - リンク展開機能')
                .setDescription([
                    '```Discordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。',
                    '流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。```\n**【現在の設定】**',
                ].join(''))
                .setColor('Green')
                .addFields({ name: 'リンク展開', value: settingSwicher('STATUS_ENABLE', linkOpen), inline: true });
            const select = new discord.ActionRowBuilder().addComponents([
                new discord.SelectMenuBuilder()
                    .setCustomId('linkOpenSetting')
                    .addOptions({ label: '全般設定', value: 'setting-linkOpen-1', emoji: '966588719635267624', default:true }),
            ]);
            button.addComponents([
                new discord.ButtonBuilder()
                    .setCustomId('setting-linkOpen')
                    .setLabel(settingSwicher('BUTTON_LABEL', linkOpen))
                    .setStyle(settingSwicher('BUTTON_STYLE', linkOpen)),
            ]);

            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-log') {
            const { log, logCh } = config.get();

            const categoryData = [
                { name: 'botLog', value: `\` ${interaction.client.user.username} \`` },
                { name: 'messageDelete', value: '`メッセージ削除`' },
                { name: 'timeout', value: '`タイムアウト`' },
                { name: 'kick', value: '`Kick`' },
                { name: 'ban', value: '`BAN`' },
            ];
            const enableCategory = categoryData.filter(v => logConfig.get(v.name)).map(v => v['value']);

            const embed = new discord.EmbedBuilder()
                .setTitle('🛠 設定 - ログ機能')
                .setDescription([
                    '```サーバー上のモデレーションやアクティビティをログとして送信する機能です。',
                    '監査ログを使用するよりも簡単に確認することができます。```\n**【現在の設定】**',
                ].join(''))
                .setColor('Green')
                .addFields(
                    { name: 'ログ機能', value: settingSwicher('STATUS_CH', log, logCh), inline: true },
                    { name: 'イベント', value: enableCategory.join(' ') || 'なし', inline: true },
                );
            const select = new discord.ActionRowBuilder().addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('logSetting')
                    .addOptions(
                        { label: '全般設定', value: 'setting-logSetting-general', emoji: '966588719635267624', default:true },
                        { label: 'イベント設定', value: 'setting-logSetting-event', emoji: '966588719635263539' },
                    ),
            );
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-log')
                    .setLabel(settingSwicher('BUTTON_LABEL', log))
                    .setStyle(settingSwicher('BUTTON_STYLE', log))
                    .setDisabled(settingSwicher('BUTTON_DISABLE', log, logCh)),
                new discord.ButtonBuilder()
                    .setCustomId('setting-logCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle(discord.ButtonStyle.Secondary),
            );

            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-verification') {
            const { verification } = config.get();
            const { newLevel, startChangeTime, endChangeTime } = verificationConfig.get();

            const levelStatus = [
                { key: 1, value: '🟢**低** `メール認証がされているアカウントのみ`' },
                { key: 2, value: '🟡**中** `Discordに登録してから5分以上経過したアカウントのみ`' },
                { key: 3, value: '🟠**高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`' },
                { key: 4, value: '🔴**最高** `電話認証がされているアカウントのみ`' },
            ];
            const time = (startChangeTime !== null ? `${startChangeTime}:00` : '未設定') + ' ～ ' + (endChangeTime !== null ? `${endChangeTime}:00` : '未設定');

            const embed = new discord.EmbedBuilder()
                .setTitle('🛠 設定 - 認証レベル自動変更機能')
                .setDescription([
                    `${discord.formatEmoji('966588719614275584')} この機能の実行ログは\`ログ機能\`の\`${interaction.client.user.username}\`に含まれています。`,
                    '```サーバーの認証レベルを指定した時間まで自動で変更する機能です。',
                    '運営が浮上できない時間帯に設定することで荒らし対策をすることができます。```\n**【現在の設定】**',
                ].join(''))
                .setColor('Green')
                .addFields(
                    { name: '状態', value: settingSwicher('STATUS_ENABLE', verification), inline: true },
                    { name: '自動変更期間', value: time, inline: true },
                    { name: '自動変更するレベル', value: levelStatus.find(v => v.key == newLevel)?.value ?? '未設定' },
                );
            const select = new discord.ActionRowBuilder().addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('verificationSetting')
                    .setOptions(
                        { label: '全般設定', value: 'setting-verificationSetting-general', emoji: '966588719635267624', default:true },
                        { label: '認証レベル設定', description: '自動変更期間の間変更されるレベル', value: 'setting-verificationSetting-level', emoji: '966588719635263539' },
                    ),
            );
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-verification')
                    .setLabel(settingSwicher('BUTTON_LABEL', verification))
                    .setStyle(settingSwicher('BUTTON_STYLE', verification))
                    .setDisabled(settingSwicher('BUTTON_DISABLE', newLevel)),
                new discord.ButtonBuilder()
                    .setCustomId('settin-startChangeTime')
                    .setLabel('開始時刻')
                    .setEmoji('1014603109001085019')
                    .setStyle(discord.ButtonStyle.Secondary),
                new discord.ButtonBuilder()
                    .setCustomId('setting-endChangeTime')
                    .setLabel('終了時刻')
                    .setEmoji('1014603109001085019')
                    .setStyle(discord.ButtonStyle.Secondary),
            );

            interaction.update({ embeds: [embed], components: [select, button] });
        }
    },
};
module.exports = [ ping_command ];