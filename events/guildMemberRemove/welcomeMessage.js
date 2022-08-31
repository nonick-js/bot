const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const { leave, leaveCh, log, logCh } = config.get();
        if (!leave) return;

        const logConfig = await member.db_logConfig.findOne({ where: { serverId: member.guild.id } });

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(leaveCh).catch(() => {});
        if (!channel) {
            member.db_config.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } });

            if (log && logConfig.get('botLog')) {
                const embed = new discord.EmbedBuilder()
                    .setTitle('入退室ログ')
                    .setDescription([
                        '❌**退室ログ**がリセットされました。',
                        '**理由:** 送信先のチャンネルが削除されている',
                    ].join('\n'))
                    .setColor('516ff5');

                // eslint-disable-next-line no-empty-function
                const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

                return logChannel.send({ embeds: [embed] }).catch(() => member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
            }
        }

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: `${member.user.username} との連携が解除されました`, iconURL: member.displayAvatarURL() })
            .setColor('Red');

        channel.send({ content: member.user.bot ? '' : `**${member.user.tag}** がサーバーを退出しました👋`, embeds: [member.user.bot ? embed : undefined ] })
            .catch(async () => {
                member.db_config.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } });

                if (log && logConfig.get('botLog')) {
                    const error = new discord.EmbedBuilder()
                        .setTitle('入退室ログ')
                        .setDescription([
                            '❌**退室ログ**がリセットされました。',
                            '**理由:** 必要な権限(`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)が与えられていない',
                        ].join('\n'))
                        .setColor('516ff5');

                    // eslint-disable-next-line no-empty-function
                    const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

                    return logChannel.send({ embeds: [error] }).catch(() => member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
                }
            });

    },
};