// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

 module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const logConfig = await member.db_logConfig.findOne({ where: { serverId: member.guild.id } });

        if (!config.get('log') || !logConfig.get('kick')) return;
        // eslint-disable-next-line no-empty-function
        const auditLogs = await member.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberKick, limit: 3 }).catch(() => {});
        const kickLog = auditLogs?.entries?.find(v => v.target == member.user);
        if (!kickLog || kickLog?.createdAt < member.joinedAt) return;

        const embed = new discord.EmbedBuilder()
            .setTitle('🔨Kick')
            .setDescription(`${member.user} (\`${member.user.id}\`)`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Orange')
            .setFields({ name: '理由', value: `\`\`\`${kickLog.reason ?? '入力されていません'}\`\`\`` })
            .setFooter({ text: kickLog.executor.tag, iconURL: kickLog.executor.displayAvatarURL() })
            .setTimestamp();

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return member.db_config.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => member.db_config.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
    },
};