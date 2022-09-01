// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-endChangeTime',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const modal = new discord.ModalBuilder()
            .setCustomId('setting-verificationTime')
            .setTitle('自動認証レベル変更')
            .setComponents(
                new discord.ActionRowBuilder().setComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('endChangeTime')
                        .setLabel('終了時刻 ※時間単位 (0 ~ 23)')
                        .setMaxLength(2)
                        .setStyle(discord.TextInputStyle.Short),
                ),
            );
        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];