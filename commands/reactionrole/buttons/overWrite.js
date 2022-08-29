// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-OverWrite',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRowComponent} */
        const select = interaction.message.components[0];

        if (select.type == discord.ComponentType.Button) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ まだ1つもロールを追加していません！')
                .setColor('Red');
            return interaction.update({ embeds: [error, error] });
        }

        if (interaction.message.components[1].components[3].label == '複数選択') {
            select.components[0] = discord.SelectMenuBuilder.from(select.components[0]).setMaxValues(select.components[0].options.length);
        }

        // eslint-disable-next-line no-empty-function
        const panel = await interaction.channel.messages.fetch(interaction.message.embeds[0].footer.text).catch(() => {});
        const messageId = interaction.message.embeds[0].footer.text;
        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0]).setFooter(null);

        if (!panel) {
            return interaction.channel.send({ embeds: [embed], components: [select] })
                .then(() => {
                    const success = new discord.EmbedBuilder()
                        .setDescription('✅ 元のパネルが見つからないため、新たにパネルを送信しました！')
                        .setColor('Green');
                    interaction.update({ content: '', embeds: [success], components:[] });
                }).catch(() => {
                    embed.setAuthor({ name: `${messageId}`, iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png' });
                    const error = new discord.EmbedBuilder()
                        .setDescription('❌ このチャンネルに送信する権限がありません！')
                        .setColor('Red');
                    interaction.update({ embeds: [embed, error] });
                });
        }

        panel.edit({ embeds: [embed], components: [select] })
            .then(() => {
                const success = new discord.EmbedBuilder()
                    .setDescription('✅ パネルを編集しました!')
                    .setColor('Green');
                interaction.update({ content: '', embeds: [success], components:[] });
            }).catch(() => {
                embed.setFooter({ text: `${messageId}`, iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png' });
                const error = new discord.EmbedBuilder()
                    .setDescription('❌ このチャンネルに送信する権限がありません！')
                    .setColor('Red');
                interaction.update({ embeds: [embed, error] });
            });
    },
};
module.exports = [ ping_command ];