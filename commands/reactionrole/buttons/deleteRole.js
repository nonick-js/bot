// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-DeleteRole',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRowComponent} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRowComponent} */
        const button = interaction.message.components[1];

        if (select.components[0].type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ まだ1つもロールを追加していません!')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (select.components[0].options.length == 1) return interaction.update({ embeds: [embed], components: [button] });

        const modal = new discord.ModalBuilder()
            .setCustomId('deleteRole')
            .setTitle('ロール削除')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('textinput')
                        .setLabel('ロールの名前')
                        .setMaxLength(100)
                        .setStyle(discord.TextInputStyle.Short),
                ),
            );
        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];