// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-sendEmbed',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const modal = new discord.ModalBuilder()
            .setCustomId('embed-sendEmbedModal')
            .setTitle('送信')
            .setComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('name')
                        .setLabel('名前 (省略可能)')
                        .setMaxLength(80)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('iconURL')
                        .setLabel('アイコンのURL (省略可能)')
                        .setMaxLength(500)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
            );
        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];