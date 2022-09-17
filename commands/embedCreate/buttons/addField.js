// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-addField',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const modal = new discord.ModalBuilder()
            .setCustomId('embed-addFieldModal')
            .setTitle('フィールドを追加')
            .setComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('name')
                        .setLabel('フィールドの名前')
                        .setMaxLength(256)
                        .setStyle(discord.TextInputStyle.Short),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('value')
                        .setLabel('フィールドの値')
                        .setMaxLength(1024)
                        .setStyle(discord.TextInputStyle.Paragraph),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];