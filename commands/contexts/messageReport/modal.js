// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'messageReport',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention, reportCh, log, logCh } = config.get();

        const logConfig = await interaction.db_logConfig.findOne({ where: { serverId: interaction.guild.id } });

        const messageId = interaction.components[0].components[0].customId;
        const reportReason = interaction.components[0].components[0].value;

        // eslint-disable-next-line no-empty-function
        const message = await interaction.channel.messages.fetch(messageId).catch(() => {});
        if (!message) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ 通報しようとしているメッセージは削除されました。')
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.EmbedBuilder()
            .setTitle('⚠️ 通報 (メッセージ)')
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .addFields(
                { name: '投稿者', value: `${message.author}`, inline:true },
                { name: '投稿先', value: `${message.channel} [リンク](${message.url})`, inline:true },
            )
            .setColor('Red')
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        if (message.content) embed.addFields({ name: 'メッセージ', value: `${message.content}` });
		if (message.attachments.first()) {
			const reportedMessageFile = message.attachments.first();
			if (reportedMessageFile.height && reportedMessageFile.width) embed.setImage(reportedMessageFile.url);
		}

        // eslint-disable-next-line no-empty-function
        const Ch = await interaction.guild.channels.fetch(reportCh).catch(() => {});
        if (!Ch) {
            interaction.db_config.update({ reportCh: null }, { where: { serverId: interaction.guildId } });

            const errorEmbed = new discord.EmbedBuilder()
                .setDescription('❌ 通報の送信中に問題が発生しました。')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });

            if (log && logConfig.get('botLog')) {
                const error = new discord.EmbedBuilder()
                    .setTitle('通報機能')
                    .setDescription([
                        '❌**通報機能の送信先**がリセットされました。',
                        '**理由:** 送信先のチャンネルが削除されている',
                    ].join('\n'))
                    .setColor('516ff5');

                // eslint-disable-next-line no-empty-function
                const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } });

                logChannel.send({ embeds: [error] }).catch(() => interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } }));
            }

            return;
        }

        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

        Ch.send({ content: content, embeds: [embed] })
            .then(() => {
                const successEmbed = new discord.EmbedBuilder()
                    .setDescription('✅ **報告ありがとうございます！** 通報をサーバー運営に送信しました！')
                    .setColor('Green');
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(async () => {
                interaction.db_config.update({ reportCh: null }, { where: { serverId: interaction.guildId } });

                const errorEmbed = new discord.EmbedBuilder()
                    .setDescription('❌ 通報の送信中に問題が発生しました。')
                    .setColor('Red');
                interaction.reply({ embeds: [errorEmbed], ephemeral: true });

                if (log && logConfig.get('botLog')) {
                    const error = new discord.EmbedBuilder()
                        .setTitle('通報機能')
                        .setDescription([
                            '❌**通報機能の送信先**がリセットされました。',
                            '**理由:** 必要な権限(`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)が与えられていない',
                        ].join('\n'))
                        .setColor('516ff5');

                    // eslint-disable-next-line no-empty-function
                    const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } });

                    return logChannel.send({ embeds: [error] }).catch(() => interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } }));
                }
            });
    },
};
module.exports = [ ping_command ];