// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-author',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];

        const modal = new discord.ModalBuilder()
            .setCustomId('embed-authorModal')
            .setTitle('投稿者')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('name')
                        .setLabel('名前')
                        .setMaxLength(256)
                        .setValue(embed.author?.name || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('iconURL')
                        .setLabel('アイコンのURL')
                        .setMaxLength(1000)
                        .setValue(embed.author?.iconURL || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('url')
                        .setLabel('ハイパーリンク')
                        .setMaxLength(1000)
                        .setValue(embed.author?.url || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
            );

    interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];