// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-reportCh',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const modal = new discord.ModalBuilder()
            .setCustomId('setting-Channel')
            .setTitle('通報の送信先')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('reportCh')
                        .setLabel('チャンネル名')
                        .setMaxLength(100)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(true),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];