// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-image',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];

        const modal = new discord.ModalBuilder()
            .setCustomId('embed-imageModal')
            .setTitle('画像')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('thumbnail')
                        .setLabel('サムネイルに設定するURL')
                        .setMaxLength(1000)
                        .setValue(embed.thumbnail?.url || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('image')
                        .setLabel('埋め込み内画像に設定するURL')
                        .setMaxLength(1000)
                        .setValue(embed.image?.url || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
            );

    interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];