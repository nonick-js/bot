// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../../modules/switcher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-settingCategory',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle(discord.ButtonStyle.Primary),
        );

        select.components[0].options.filter(v => v.value !== interaction.values[0]).forEach(v => v.default = false);
        select.components[0].options.filter(v => v.value == interaction.values[0]).forEach(v => v.default = true);

        if (interaction.values[0].startsWith('category-welcomeMessage')) {
            const welcomeMModel = await require('../../../../models/welcomeM')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

            switch (interaction.values[0]) {
                case 'category-welcomeMessage-welcome': {
                    const { welcome, welcomeCh } = welcomeMModel.get();

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
                    break;
                }
                case 'category-welcomeMessage-leave': {
                    const { leave, leaveCh } = welcomeMModel.get();

                    button.addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId('setting-leave')
                            .setLabel(settingSwitcher('BUTTON_LABEL', leave))
                            .setStyle(settingSwitcher('BUTTON_STYLE', leave))
                            .setDisabled(settingSwitcher('BUTTON_DISABLE', leaveCh)),
                        new discord.ButtonBuilder()
                            .setCustomId('setting-leaveCh')
                            .setLabel('送信先')
                            .setEmoji('966588719635267624')
                            .setStyle(discord.ButtonStyle.Secondary),
                        new discord.ButtonBuilder()
                            .setCustomId('setting-leaveMessage')
                            .setLabel('メッセージ')
                            .setEmoji('966596708458983484')
                            .setStyle(discord.ButtonStyle.Secondary),
                    );
                    break;
                }
            }

            interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
        }

        if (interaction.values[0].startsWith('category-report')) {
            const basicModel = await require('../../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
            const { reportRoleMention, reportRole } = basicModel.get();

            switch (interaction.values[0]) {
                case 'category-report-general': {
                    button.addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId('setting-reportCh')
                            .setLabel('送信先')
                            .setEmoji('966588719635267624')
                            .setStyle(discord.ButtonStyle.Secondary),
                    );
                    break;
                }
                case 'category-report-roleMention': {
                    button.addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId('setting-reportRoleMention')
                            .setLabel(settingSwitcher('BUTTON_LABEL', reportRoleMention))
                            .setStyle(settingSwitcher('BUTTON_STYLE', reportRoleMention))
                            .setDisabled(settingSwitcher('BUTTON_DISABLE', reportRole)),
                        new discord.ButtonBuilder()
                            .setCustomId('setting-reportRole')
                            .setLabel('ロール')
                            .setEmoji('966719258430160986')
                            .setStyle(discord.ButtonStyle.Secondary),
                    );
                    break;
                }
            }

            interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
        }

        if (interaction.values[0].startsWith('category-log')) {
            const logModel = await require('../../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
            const { log, logCh } = logModel.get();

            switch (interaction.values[0]) {
                case 'category-log-general': {
                    button.addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId('setting-log')
                            .setLabel(settingSwitcher('BUTTON_LABEL', log))
                            .setStyle(settingSwitcher('BUTTON_STYLE', log))
                            .setDisabled(settingSwitcher('BUTTON_DISABLE', logCh)),
                        new discord.ButtonBuilder()
                            .setCustomId('setting-logCh')
                            .setLabel('送信先')
                            .setEmoji('966588719635267624')
                            .setStyle(discord.ButtonStyle.Secondary),
                    );

                    interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
                    break;
                }
                case 'category-log-event': {
                    const logEventSelect = new discord.ActionRowBuilder().addComponents(
                        new discord.SelectMenuBuilder()
                            .setCustomId('setting-logEvents')
                            .setMaxValues(4)
                            .setPlaceholder('有効にしたいイベントを選択')
                            .setOptions(
                                { label: `${interaction.client.user.username}`, description: 'BOTのエラー等', value: 'bot', emoji: '966596708484149289' },
                                { label: 'タイムアウト', value: 'timeout', emoji: '969148338597412884' },
                                { label: 'Kick', value: 'kick', emoji: '969148338597412884' },
                                { label: 'BAN', value: 'ban', emoji: '969148338597412884' },
                            ),
                    );
                    button.addComponents(
                        new discord.ButtonBuilder()
                            .setCustomId('setting-logEvents-removeAll')
                            .setLabel('全てのイベントを無効')
                            .setStyle(discord.ButtonStyle.Danger)
                            .setDisabled(settingSwitcher('BUTTON_DISABLE', interaction.message.embeds[0].fields[1].value !== 'なし')),
                    );

                    interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, logEventSelect, button] });
                    break;
                }
            }
        }

        if (interaction.values[0].startsWith('category-verification')) {
            const verificationModel = await require('../../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
            const { verification, newLevel } = verificationModel.get();

            switch (interaction.values[0]) {
                case 'category-verification-general': {
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

                    interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
                    break;
                }
                case 'category-verification-level': {
                    const logEventSelect = new discord.ActionRowBuilder().addComponents(
                        new discord.SelectMenuBuilder()
                            .setCustomId('setting-newLevel')
                            .setOptions(
                                { label: '低', description: 'メール認証がされているアカウントのみ', value: '1', emoji: '🟢', default: newLevel == 1 },
                                { label: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ', value: '2', emoji: '🟡', default: newLevel == 2 },
                                { label: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ', value: '3', emoji: '🟠', default: newLevel == 3 },
                                { label: '最高', description: '電話認証がされているアカウントのみ', value: '4', emoji: '🔴', default: newLevel == 4 },
                            ),
                    );

                    interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, logEventSelect, button] });
                    break;
                }
            }
        }

        if (!interaction.values?.[0]) interaction.update({});
    },
};
module.exports = [ ping_command ];