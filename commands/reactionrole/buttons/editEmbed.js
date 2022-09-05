// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-editEmbed',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.Embed} */
        const embed = interaction.message.embeds[0];

        const modal = new discord.ModalBuilder()
            .setCustomId('reactionRole-editEmbedModal')
            .setTitle('埋め込みの編集')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('タイトル')
                        .setMaxLength(1000)
                        .setValue(embed.title)
                        .setStyle(discord.TextInputStyle.Short),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('説明')
                        .setMaxLength(4000)
                        .setValue(embed?.description || '')
                        .setStyle(discord.TextInputStyle.Paragraph)
                        .setRequired(false),
                ),
            );
        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];