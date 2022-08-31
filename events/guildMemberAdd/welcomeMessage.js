const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const { welcome, welcomeCh, welcomeMessage, log, logCh } = config.get();
        if (!welcome) return;

        const logConfig = await member.db_logConfig.findOne({ where: { serverId: member.guild.id } });

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(welcomeCh).catch(() => {});
        if (!channel) {
            member.db_config.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } });

            if (log && logConfig.get('botLog')) {
                const embed = new discord.EmbedBuilder()
                    .setTitle('入退室ログ')
                    .setDescription([
                        '❌**入室ログ**がリセットされました。',
                        '**理由:** 送信先のチャンネルが削除されている',
                    ].join('\n'))
                    .setColor('516ff5');

                // eslint-disable-next-line no-empty-function
                const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

                return logChannel.send({ embeds: [embed] }).catch(() => member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
            }
        }

        const welcomeEmbed_member = new discord.EmbedBuilder()
            .setTitle('WELCOME!')
            .setDescription([
                `${member} **(${member.user.tag})** さん`,
                `**${member.guild.name}** へようこそ!`,
                `${welcomeMessage}\n`,
                `現在のメンバー数: **${member.guild.memberCount}人**`,
            ].join('\n'))
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green');

        const welcomeEmbed_bot = new discord.EmbedBuilder()
            .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
            .setColor('Blue');

        channel.send({ embeds: [member.user.bot ? welcomeEmbed_bot : welcomeEmbed_member] })
            .catch(async () => {
                member.db_config.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } });

                if (log && logConfig.get('botLog')) {
                    const embed = new discord.EmbedBuilder()
                        .setTitle('入退室ログ')
                        .setDescription([
                            '❌**入室ログ**がリセットされました。',
                            '**理由:** 必要な権限(`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)が与えられていない',
                        ].join('\n'))
                        .setColor('516ff5');

                    // eslint-disable-next-line no-empty-function
                    const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

                    return logChannel.send({ embeds: [embed] }).catch(() => member.db_logConfig.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
                }
            });
    },
};