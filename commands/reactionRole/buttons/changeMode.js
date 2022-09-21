// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-changeMode',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];
        const content = interaction.message.content.split('\n');

        if (select.components[0].type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 先にロールを追加してください!')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        if (button.components[3].label == '複数選択') {
            button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('単一選択');
            const newContent = [content[0], content[1], '` 現在の選択モード: 複数選択 `'].join('\n');
            interaction.update({ content: newContent, embeds: [interaction.message.embeds[0]], components: [select, button] });
        }
        else {
            button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('複数選択');
            const newContent = [content[0], content[1], '` 現在の選択モード: 単一選択 `'].join('\n');
            interaction.update({ content: newContent, embeds: [interaction.message.embeds[0]], components: [select, button] });
        }
    },
};
module.exports = [ ping_command ];