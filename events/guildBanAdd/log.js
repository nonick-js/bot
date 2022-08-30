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
        const auditLogs = await ban.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberBanAdd });
        const banLog = auditLogs.entries.find(v => v.target == ban.user);

        const embed = new discord.EmbedBuilder()
            .setTitle('BAN')
            .setDescription(`${ban.user} \`${ban.user.id}\`\n\`\`\`${ban.reason ?? '理由が入力されていません'}\`\`\``)
            .setThumbnail(ban.user.displayAvatarURL())
            .setColor('Red')
            .setFooter({ text: banLog.executor.tag, iconURL: banLog.executor.displayAvatarURL() });

        // eslint-disable-next-line no-empty-function
        const channel = await ban.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return ban.db_config.update({ log: false, logCh: null }, { where: { serverId: ban.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => ban.db_config.update({ log: false, logCh: null }, { where: { serverId: ban.guild.id } }));
    },
};