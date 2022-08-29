const discord = require('discord.js');
const { settingSwicher } = require('../../../modules/swicher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'reportSetting',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guild.id } });
        const { reportRole, reportRoleMention } = config.get();

        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle(discord.ButtonStyle.Primary),
        );

        if (interaction.values == 'setting-report-1') {
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-reportCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle(discord.ButtonStyle.Secondary),
            );
        }

        if (interaction.values == 'setting-report-2') {
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-reportRoleMention')
                    .setLabel(settingSwicher('BUTTON_LABEL', reportRoleMention))
                    .setStyle(settingSwicher('BUTTON_STYLE', reportRoleMention))
                    .setDisabled(settingSwicher('BUTTON_DISABLE', reportRole)),
                new discord.ButtonBuilder()
                    .setCustomId('setting-reportRole')
                    .setLabel('ロール')
                    .setEmoji('966719258430160986')
                    .setStyle(discord.ButtonStyle.Secondary),
            );
        }

        for (let i = 0; i < select.components[0].options.length; i++) {
            select.components[0].options[i].default = false;
        }
        const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
        select.components[0].options[index].default = true;

        interaction.update({ components: [select, button], ephemeral: true });
    },
};
module.exports = [ ping_command ];