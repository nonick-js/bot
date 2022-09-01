// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwicher } = require('../../../../modules/swicher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'verificationSetting',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const verificationConfig = await interaction.db_verificationConfig.findOne({ where: { serverId: interaction.guildId } });

        const { verification } = config.get();
        const { newLevel } = verificationConfig.get();

        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle(discord.ButtonStyle.Primary),
        );

        if (interaction.values == 'setting-verificationSetting-general') {
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
            setDefault();
            interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
        }

        if (interaction.values == 'setting-verificationSetting-level') {
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
            setDefault();
            interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, logEventSelect, button] });
        }

        function setDefault() {
            for (let i = 0; i < select.components[0].options.length; i++) {
                select.components[0].options[i].default = false;
            }
            const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
            select.components[0].options[index].default = true;
        }
    },
};
module.exports = [ ping_command ];