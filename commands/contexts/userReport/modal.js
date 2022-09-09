// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'userReport',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const basicModel = await require('../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const logModel = await require('../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guild.id } });
        const { reportRole, reportRoleMention, reportCh } = basicModel.get();
        const { log, logCh, bot } = logModel.get();

        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const user = await interaction.client.users.fetch(customId).catch(() => {});

        const embed = new discord.EmbedBuilder()
            .setTitle('⚠️ 通報 (メンバー)')
            .setDescription(`\`\`\`${value}\`\`\``)
            .setColor('Red')
            .setFields({ name: '対象者', value: `${user}`, inline:true })
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';
        const channel = await interaction.guild.channels.fetch(reportCh).catch(() => {});

        try {
            if (!channel) throw '**通報機能**がリセットされました。\n**理由:** 送信先のチャンネルが削除されている';
            if (!channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) throw '**入室ログ**がリセットされました。\n**理由:** 権限が不足している (`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)';
        } catch (err) {
            basicModel.update({ reportCh: null }).catch(() => {});

            if (log && bot) {
                const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return logModel.update({ log: false, logCh: null }).catch(() => {});

                const error = new discord.EmbedBuilder()
                    .setTitle('入退室ログ')
                    .setDescription(`❌ ${err}`)
                    .setColor('516ff5');
                logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
            }
            return;
        }

        channel.send({ content: content, embeds: [embed] })
            .then(() => {
                const successEmbed = new discord.EmbedBuilder()
                    .setDescription('✅ **報告ありがとうございます！** 通報をサーバー運営に送信しました！')
                    .setColor('Green');
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(async (err) => {
                basicModel.update({ reportCh: null }).catch(() => {});

                const errorEmbed = new discord.EmbedBuilder()
                    .setDescription('❌ 通報の送信中に問題が発生しました。')
                    .setColor('Red');
                interaction.reply({ embeds: [errorEmbed], ephemeral: true });

                if (log && bot) {
                    const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return logModel.update({ log: false, logCh: null }).catch(() => {});

                    const error = new discord.EmbedBuilder()
                        .setTitle('通報機能')
                        .setDescription(`❌ **通報機能**がリセットされました。\n**理由:** 不明なエラー\`\`\`${err}\`\`\``)
                        .setColor('516ff5');
                    logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
                }
            });
    },
};
module.exports = [ ping_command ];