// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwicher } = require('../../../../modules/swicher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'logSetting',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const { log, logCh } = config.get();

        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle(discord.ButtonStyle.Primary),
        );

        if (interaction.values == 'setting-log-general') {
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
            setDefault();
            interaction.update({ components: [select, button] });
        }

        if (interaction.values == 'setting-logSetting-event') {
            const logEventSelect = new discord.ActionRowBuilder().addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('setting-logEvents')
                    .setMaxValues(5)
                    .setPlaceholder('有効にしたいイベントを選択')
                    .setOptions(
                        { label: `${interaction.client.user.username}`, description: 'BOTのエラー等', value: 'botLog', emoji: '966596708484149289' },
                        { label: 'メッセージ削除', value: 'messageDelete', emoji: '966596708458983484' },
                        { label: 'タイムアウト', value: 'timeout', emoji: '969148338597412884' },
                        { label: 'Kick', value: 'kick', emoji: '969148338597412884' },
                        { label: 'BAN', value: 'ban', emoji: '969148338597412884' },
                    ),
            );
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-logEvents-removeAll')
                    .setLabel('全てのイベントを無効')
                    .setStyle(discord.ButtonStyle.Danger),
            );
            setDefault();
            interaction.update({ components: [select, logEventSelect, button] });
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