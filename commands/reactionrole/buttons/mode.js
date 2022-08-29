// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-Mode',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        if (select.components[0].type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 先にロールを追加してください!')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (button.components[3].label == '単一選択') button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('複数選択');
        else button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('単一選択');
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];