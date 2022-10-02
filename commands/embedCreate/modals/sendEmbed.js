// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-sendEmbedModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        if (interaction.fields.getTextInputValue('name') || interaction.fields.getTextInputValue('iconURL')) {

            const name = interaction.fields.getTextInputValue('name') || 'NoNICK.js';
            const iconURL = interaction.fields.getTextInputValue('iconURL');

            const webhooks = await interaction.guild.fetchWebhooks().catch(() => {});

            try {
                if (!interaction.guild.members.me.permissions.has(discord.PermissionFlagsBits.ManageWebhooks)) {
                    throw [
                        `**${interaction.client.user.username}**がこの動作を行うための権限が不足しています！`,
                        '**必要な権限**: `ウェブフックの管理`',
                    ].join('\n');
                }
                if (iconURL && (!iconURL.startsWith('https://') || iconURL.startsWith('http://'))) throw 'アイコンのURLが無効です！';
                if (!webhooks) throw ('何らかの原因でWebhookが正しく作成されませんでした。時間をおいて再度お試しください。');
            } catch (err) {
                const error = new discord.EmbedBuilder()
                    .setDescription(`❌ ${err}`)
                    .setColor('Red');
                await interaction.deferUpdate();
                return interaction.editReply({ embeds: [interaction.message.embeds[0], error] });
            }

            /** @type {import('discord.js').Webhook} */
            const myWebhook = webhooks?.find(webhook => webhook.owner == interaction.client.user) || await interaction.channel.createWebhook({ name: name }).catch(() => {});
            myWebhook.edit({ name: name, avatar: iconURL, channel: interaction.channel.id });
            myWebhook.send({ embeds: [interaction.message.embeds[0]] })
                .then(() => {
                    const success = new discord.EmbedBuilder()
                        .setDescription('✅ 埋め込みを送信しました!')
                        .setColor('Green');
                    interaction.editReply({ content: ' ', embeds: [success], components:[] });
                })
                .catch((err) => {
                    const error = new discord.EmbedBuilder()
                        .setTitle('エラー！')
                        .setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
                        .setColor('Red');
                    interaction.editReply({ embeds: [interaction.message.embeds[0], error] });
                });
        } else {
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
        }
    },
};
module.exports = [ ping_command ];