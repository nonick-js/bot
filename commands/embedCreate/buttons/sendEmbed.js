// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'embed-sendEmbed',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) {
            const error = new discord.EmbedBuilder()
                .setDescription([
                    `❌ ${interaction.channel}での**${interaction.client.user.username}**の権限が不足しています！`,
                    '**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
                ].join('\n'))
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        interaction.channel.send({ embeds: [interaction.message.embeds[0]] })
            .then(() => {
                const success = new discord.EmbedBuilder()
                    .setDescription('✅ 埋め込みを送信しました!')
                    .setColor('Green');
                interaction.update({ content: ' ', embeds: [success], components:[] });
            })
            .catch((err) => {
                const error = new discord.EmbedBuilder()
                    .setTitle('エラー！')
                    .setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
                    .setColor('Red');
                interaction.update({ embeds: [interaction.message.embeds[0], error] });
            });
    },
};
module.exports = [ ping_command ];