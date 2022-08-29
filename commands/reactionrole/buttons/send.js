// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-Send',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];

        if (select.components[0].type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ まだ1つもロールを追加していません！')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (interaction.message.components[1].components[3].label == '複数選択') {
            select.components[0] = discord.SelectMenuBuilder.from(select.components[0]).setMaxValues(select.components[0].options.length);
        }

        interaction.channel.send({ embeds: [embed], components: [select] })
            .then(() => {
                const success = new discord.EmbedBuilder()
                    .setDescription('✅ パネルを作成しました!')
                    .setColor('Green');
                interaction.update({ content: ' ', embeds: [success], components:[] });
            })
            .catch(() => {
                const error = new discord.EmbedBuilder()
                    .setDescription('❌ このチャンネルに送信する権限がありません！')
                    .setColor('Red');
                interaction.update({ embeds: [embed, error] });
            });
    },
};
module.exports = [ ping_command ];