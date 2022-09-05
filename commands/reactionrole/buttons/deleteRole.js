// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-deleteRole',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        if (select.components[0].type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ まだ1つもロールを追加していません!')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        if (select.components[0].options.length == 1) return interaction.update({ embeds: [interaction.message.embeds[0]], components: [button] });

        const modal = new discord.ModalBuilder()
            .setCustomId('reactionRole-deleteRoleModal')
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