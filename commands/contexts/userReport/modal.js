// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'userReport',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const logConfig = await interaction.db_logConfig.findOne({ where: { serverId: interaction.guild.id } });
        const { reportRole, reportRoleMention, reportCh, log, logCh } = config.get();

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

        const Ch = await interaction.guild.channels.fetch(reportCh).catch(() => {});
        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

        if (!Ch) {
            interaction.db_config.update({ reportCh: null }, { where: { serverId: interaction.guildId } });

            const errorEmbed = new discord.EmbedBuilder()
                .setDescription('❌ 通報の送信中に問題が発生しました。')
                .setColor('Red');
            interaction.reply({ embeds: [errorEmbed], ephemeral: true });

            if (log && logConfig.get('botLog')) {
                const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } });

                const error = new discord.EmbedBuilder()
                    .setTitle('通報機能')
                    .setDescription('❌ **通報機能の送信先**がリセットされました。\n**理由:** 送信先のチャンネルが削除されている')
                    .setColor('516ff5');

                logChannel.send({ embeds: [error] }).catch(() => interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } }));
            }
            return;
        }

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
                    const logChannel = await interaction.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } });

                    const error = new discord.EmbedBuilder()
                        .setTitle('通報機能')
                        .setDescription('❌**通報機能の送信先**がリセットされました。\n**理由:** 必要な権限(`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)が与えられていない')
                        .setColor('516ff5');

                    logChannel.send({ embeds: [error] }).catch(() => interaction.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: interaction.guild.id } }));
                }
            });
    },
};
module.exports = [ ping_command ];