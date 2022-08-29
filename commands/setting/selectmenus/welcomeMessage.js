const discord = require('discord.js');
const { settingSwicher } = require('../../../modules/swicher');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'welcomeMessageSetting',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guild.id } });
        const { welcome, welcomeCh, leave, leaveCh } = config.get();

        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle(discord.ButtonStyle.Primary),
        );

        if (interaction.values == 'setting-welcome-1') {
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
        }

        if (interaction.values == 'setting-welcome-2') {
            button.addComponents(
                new discord.ButtonBuilder()
                    .setCustomId('setting-leave')
                    .setLabel(settingSwicher('BUTTON_LABEL', leave))
                    .setStyle(settingSwicher('BUTTON_STYLE', leave))
                    .setDisabled(settingSwicher('BUTTON_DISABLE', leaveCh)),
                new discord.ButtonBuilder()
                    .setCustomId('setting-leaveCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle(discord.ButtonStyle.Secondary),
            );
        }

        for (let i = 0; i < select.components[0].options.length; i++) {
            select.components[0].options[i].default = false;
        }
        const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
        select.components[0].options[index].default = true;

        interaction.update({ components: [select, button], ephemeral:true });
    },
};
module.exports = [ ping_command ];