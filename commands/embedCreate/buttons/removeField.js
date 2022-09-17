// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-removeField',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const modal = new discord.ModalBuilder()
            .setCustomId('embed-removeFieldModal')
            .setTitle('フィールドを削除')
            .setComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('name')
                        .setLabel('削除するフィールドの名前')
                        .setMaxLength(256)
                        .setStyle(discord.TextInputStyle.Short),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];