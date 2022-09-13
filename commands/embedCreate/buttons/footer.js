// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-footer',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];

        const modal = new discord.ModalBuilder()
            .setCustomId('embed-footerModal')
            .setTitle('フッター')
            .setComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('text')
                        .setLabel('テキスト')
                        .setMaxLength(2048)
                        .setValue(embed.footer?.text || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('iconURL')
                        .setLabel('アイコンのURL')
                        .setMaxLength(1000)
                        .setValue(embed.footer?.iconURL || '')
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];