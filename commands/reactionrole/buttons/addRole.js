// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-addRole',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.Embed} */
        /** @type {discord.ActionRowComponent} */
        const select = interaction.message.components[0].components[0];

        if (select.type == discord.ComponentType.SelectMenu && select.options.length == 25) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ これ以上ロールを追加できません!')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        const modal = new discord.ModalBuilder()
            .setCustomId('reactionRole-addRoleModal')
            .setTitle('ロールを追加')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('textinput')
                        .setLabel('ロールの名前')
                        .setMaxLength(100)
                        .setStyle(discord.TextInputStyle.Short),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('textinput1')
                        .setLabel('表示名')
                        .setMaxLength(100)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('textinput2')
                        .setLabel('説明')
                        .setMaxLength(100)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('textinput3')
                        .setLabel('Unicode絵文字・カスタム絵文字')
                        .setPlaceholder('カスタム絵文字は絵文字名で入力してください')
                        .setMaxLength(32)
                        .setStyle(discord.TextInputStyle.Short)
                        .setRequired(false),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];