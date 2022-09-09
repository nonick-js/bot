// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'messageReport',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const basicModel = await require('../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const logModel = await require('../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guild.id } });
        const { reportRole, reportRoleMention, reportCh } = basicModel.get();
        const { log, logCh, bot } = logModel.get();

        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const message = await interaction.channel.messages.fetch(customId).catch(() => {});

        if (!message) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ 通報しようとしているメッセージは削除されました。')
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.EmbedBuilder()
            .setTitle('⚠️ 通報 (メッセージ)')
            .setDescription(`\`\`\`${value}\`\`\``)
            .setColor('Red')
            .setFields(
                { name: '投稿者', value: `${message.author}`, inline:true },
                { name: '投稿先', value: `${message.channel} [リンク](${message.url})`, inline:true },
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        if (message.content) embed.addFields({ name: 'メッセージ', value: `${message.content}` });
		if (message.attachments.first()) {
			const reportedMessageFile = message.attachments.first();
			if (reportedMessageFile.height && reportedMessageFile.width) embed.setImage(reportedMessageFile.url);
		}

        const channel = await interaction.guild.channels.fetch(reportCh).catch(() => {});
        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

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
            .catch(async () => {
                basicModel.update({ reportCh: null });

                const errorEmbed = new discord.EmbedBuilder()
                    .setDescription('❌ 通報の送信中に問題が発生しました。')
                    .setColor('Red');
                interaction.reply({ embeds: [errorEmbed], ephemeral: true });

                if (log && bot) {
                    const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return logModel.update({ log: false, logCh: null });

                    const error = new discord.EmbedBuilder()
                        .setTitle('通報機能')
                        .setDescription('❌**通報機能の送信先**がリセットされました。\n**理由:** 必要な権限(`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)が与えられていない')
                        .setColor('516ff5');

                    logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }));
                }
            });
    },
};
module.exports = [ ping_command ];