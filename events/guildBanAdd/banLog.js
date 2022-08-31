// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanAddCallback
 * @param {discord.GuildBan} ban
 */

module.exports = {
    /** @type {guildBanAddCallback} */
    async execute(ban) {
        const config = await ban.db_config.findOne({ where: { serverId: ban.guild.id } });
        const logConfig = await ban.db_logConfig.findOne({ where: { serverId: ban.guild.id } });

        if (!config.get('log') || !logConfig.get('ban')) return;
        // eslint-disable-next-line no-empty-function
        const auditLogs = await ban.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberBanAdd, limit: 3 }).catch(() => {});
        const banLog = auditLogs?.entries?.find(v => v.target == ban.user);
        if (!banLog) return;

        const embed = new discord.EmbedBuilder()
            .setTitle('🔨BAN')
            .setDescription(`${ban.user} (\`${ban.user.id}\`)`)
            .setThumbnail(ban.user.displayAvatarURL())
            .setColor('Red')
            .setFields({ name: '理由', value: `\`\`\`${banLog.reason ?? '入力されていません'}\`\`\`` })
            .setFooter({ text: banLog.executor.tag, iconURL: banLog.executor.displayAvatarURL() })
            .setTimestamp();

        // eslint-disable-next-line no-empty-function
        const channel = await ban.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return ban.db_config.update({ log: false, logCh: null }, { where: { serverId: ban.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => ban.db_config.update({ log: false, logCh: null }, { where: { serverId: ban.guild.id } }));
    },
};