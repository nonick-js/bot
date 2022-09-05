const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const { settingSwitcher } = require('../../../../modules/switcher');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-featureCategory',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle(discord.ButtonStyle.Primary),
        );

        switch (interaction.values[0]) {
            case 'setting-welcomeMessage' : {
                const welcomeMModel = await require('../../../../models/welcomeM')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
                const { welcome, welcomeCh, welcomeMessage, leave, leaveCh, leaveMessage } = welcomeMModel.get();

                const embed = new discord.EmbedBuilder()
                    .setTitle('🛠 設定 - 入退室ログ機能')
                    .setDescription([
                        '```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。',
                        'メッセージを設定することで参加した人に見てもらいたい情報を送信できます。```\n**【現在の設定】**',
                    ].join(''))
                    .setColor('Green')
                    .setFields(
                        { name: '入室ログ', value: settingSwitcher('STATUS_CH', welcome, welcomeCh) + `\n\n${discord.formatEmoji('966596708458983484')} ${welcomeM_preview(welcomeMessage)}`, inline: true },
                        { name: '退室ログ', value: settingSwitcher('STATUS_CH', leave, leaveCh) + `\n\n${discord.formatEmoji('966596708458983484')} ${welcomeM_preview(leaveMessage)}`, inline: true },
                    );
                const select = new discord.ActionRowBuilder().addComponents([
                    new discord.SelectMenuBuilder()
                        .setCustomId('setting-settingCategory')
                        .setOptions(
                            { label: '入室ログ', value: 'category-welcomeMessage-welcome', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true },
                            { label: '退室ログ', value: 'category-welcomeMessage-leave', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' },
                        ),
                ]);
                button.addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('setting-welcome')
                        .setLabel(settingSwitcher('BUTTON_LABEL', welcome))
                        .setStyle(settingSwitcher('BUTTON_STYLE', welcome))
                        .setDisabled(settingSwitcher('BUTTON_DISABLE', welcomeCh)),
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
                break;
            }
            case 'setting-report': {
                const basicModel = await require('../../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
                const { reportCh, reportRoleMention, reportRole } = basicModel.get();

                const embed = new discord.EmbedBuilder()
                    .setTitle('🛠 設定 - 通報機能')
                    .setDescription([
                        `${discord.formatEmoji('966588719614275584')}: 機能自体を無効にしたい場合は、\`サーバー設定 → 連携サービス → NoNICK.js\`からeveryoneの権限を変更することで無効にできます。`,
                        '```メンバーがサーバールール等に違反しているメッセージを通報できる機能です。',
                        'モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。```\n**【現在の設定】**',
                    ].join(''))
                    .setColor('Green')
                    .setFields(
                        { name: '通報の送信先', value: reportCh ? `<#${reportCh}>` : `${`${discord.formatEmoji('966588719635267624')}未設定`}`, inline: true },
                        { name: 'ロールメンション', value: settingSwitcher('STATUS_ROLE', reportRoleMention, reportRole), inline: true },
                    );
                const select = new discord.ActionRowBuilder().addComponents([
                    new discord.SelectMenuBuilder()
                    .setCustomId('setting-settingCategory')
                    .setOptions([
                        { label: '全般設定', value: 'category-report-general', emoji: '🌐', default: true },
                        { label: 'ロールメンション機能', description: '通報受け取り時にロールをメンション', value: 'category-report-roleMention', emoji: '966719258430160986' },
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
                break;
            }
            case 'setting-messageExpansion': {
                const basicModel = await require('../../../../models/basic')(interaction.sequelize).findOne({ where: { serverId : interaction.guildId } });
                const { messageExpansion } = basicModel.get();

                const embed = new discord.EmbedBuilder()
                    .setTitle('🛠 設定 - リンク展開機能')
                    .setDescription([
                        '```Discordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。',
                        '流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。```\n**【現在の設定】**',
                    ].join(''))
                    .setColor('Green')
                    .setFields({ name: '状態', value: settingSwitcher('STATUS_ENABLE', messageExpansion), inline: true });
                const select = new discord.ActionRowBuilder().addComponents([
                    new discord.SelectMenuBuilder()
                        .setCustomId('setting-settingCategory')
                        .setOptions({ label: '全般設定', value: 'category-messageExpansion-general', emoji: '966588719635267624', default:true })
                        .setDisabled(true),
                ]);
                button.addComponents([
                    new discord.ButtonBuilder()
                        .setCustomId('setting-messageExpansion')
                        .setLabel(settingSwitcher('BUTTON_LABEL', messageExpansion))
                        .setStyle(settingSwitcher('BUTTON_STYLE', messageExpansion)),
                ]);

                interaction.update({ embeds: [embed], components: [select, button] });
                break;
            }
            case 'setting-log': {
                const logModel = await require('../../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
                const { log, logCh } = logModel.get();

                const logCategoryData = [
                    { name: 'bot', value: ` ${interaction.client.user.username}` },
                    { name: 'messageDelete', value: 'メッセージ削除' },
                    { name: 'timeout', value: 'タイムアウト' },
                    { name: 'kick', value: 'Kick' },
                    { name: 'ban', value: 'BAN' },
                ];
                const enableLogCategory = logCategoryData.filter(v => logModel.get(v.name)).map(v => `\`${v.value}\``);

                const embed = new discord.EmbedBuilder()
                    .setTitle('🛠 設定 - ログ機能')
                    .setDescription([
                        '```サーバー上のモデレーションやアクティビティをログとして送信する機能です。',
                        '監査ログを使用するよりも簡単に確認することができます。```\n**【現在の設定】**',
                    ].join(''))
                    .setColor('Green')
                    .setFields(
                        { name: '状態', value: settingSwitcher('STATUS_CH', log, logCh), inline: true },
                        { name: 'イベント', value: enableLogCategory.join(' ') || 'なし', inline: true },
                    );
                const select = new discord.ActionRowBuilder().addComponents(
                    new discord.SelectMenuBuilder()
                        .setCustomId('setting-settingCategory')
                        .setOptions(
                            { label: '全般設定', value: 'category-log-general', emoji: '🌐', default:true },
                            { label: 'イベント設定', value: 'category-log-event', emoji: '1014603109001085019' },
                        ),
                );
                button.addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('setting-log')
                        .setLabel(settingSwitcher('BUTTON_LABEL', log))
                        .setStyle(settingSwitcher('BUTTON_STYLE', log))
                        .setDisabled(settingSwitcher('BUTTON_DISABLE', log, logCh)),
                    new discord.ButtonBuilder()
                        .setCustomId('setting-logCh')
                        .setLabel('送信先')
                        .setEmoji('966588719635267624')
                        .setStyle(discord.ButtonStyle.Secondary),
                );

                interaction.update({ embeds: [embed], components: [select, button] });
                break;
            }
            case 'setting-verification': {
                const verificationModel = await require('../../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
                const { verification, newLevel, startChangeTime, endChangeTime } = verificationModel.get();

                const levelStatus = [
                    'この文章が見えるのはおかしいよ',
                    '🟢 **低** `メール認証がされているアカウントのみ`',
                    '🟡 **中** `Discordに登録してから5分以上経過したアカウントのみ`',
                    '🟠 **高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
                    '🔴 **最高** `電話認証がされているアカウントのみ`',
                ];
                const time = (startChangeTime !== null ? `**${startChangeTime}:00**` : '未設定') + '  ～  ' + (endChangeTime !== null ? `**${endChangeTime}:00**` : '未設定');

                const embed = new discord.EmbedBuilder()
                    .setTitle('🛠 設定 - 認証レベル自動変更機能')
                    .setDescription([
                        `${discord.formatEmoji('966588719614275584')} この機能の実行ログは\`ログ機能\`の\`${interaction.client.user.username}\`イベントに含まれています。`,
                        '```サーバーの認証レベルを指定した時間まで自動で変更する機能です。',
                        '運営が浮上できない時間帯に設定することで荒らし対策をすることができます。```\n**【現在の設定】**',
                    ].join(''))
                    .setColor('Green')
                    .setFields(
                        { name: '状態', value: settingSwitcher('STATUS_ENABLE', verification), inline: true },
                        { name: '自動変更期間', value: time, inline: true },
                        { name: '自動変更するレベル', value: levelStatus[newLevel] ?? '未設定' },
                    );
                const select = new discord.ActionRowBuilder().addComponents(
                    new discord.SelectMenuBuilder()
                        .setCustomId('setting-settingCategory')
                        .setOptions(
                            { label: '全般設定', value: 'category-verification-general', emoji: '🌐', default:true },
                            { label: '認証レベル設定', description: '自動変更期間の間変更されるレベル', value: 'category-verification-level', emoji: '966588719635263539' },
                        ),
                );
                button.addComponents(
                    new discord.ButtonBuilder()
                        .setCustomId('setting-verification')
                        .setLabel(settingSwitcher('BUTTON_LABEL', verification))
                        .setStyle(settingSwitcher('BUTTON_STYLE', verification))
                        .setDisabled(settingSwitcher('BUTTON_DISABLE', newLevel)),
                    new discord.ButtonBuilder()
                        .setCustomId('setting-startChangeTime')
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
                break;
            }
            default:
                interaction.update({});
                break;
        }

    },
};
module.exports = [ ping_command ];