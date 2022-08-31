// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildMemberUpdateCallback
 * @param {discord.GuildMember} oldMember
 * @param {discord.GuildMember} newMember
 */

module.exports = {
    /** @type {guildMemberUpdateCallback} */
    async execute(oldMember, newMember) {
        if (!oldMember.communicationDisabledUntil || oldMember.communicationDisabledUntil == newMember.communicationDisabledUntil) return;

        const config = await oldMember.db_config.findOne({ where: { serverId: newMember.guild.id } });
        const logConfig = await oldMember.db_logConfig.findOne({ where: { serverId: newMember.guild.id } });

        if (!config.get('log') || !logConfig.get('timeout')) return;
        // eslint-disable-next-line no-empty-function
        const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate, limit: 3 }).catch(() => {});
        const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
        if (!timeoutLog) return;

        const embed = new discord.EmbedBuilder()
            .setTitle('⛔タイムアウト手動解除')
            .setDescription(`${newMember.user} (\`${newMember.user.id}\`)`)
            .setColor('Blue')
            .setThumbnail(newMember.displayAvatarURL())
            .setFooter({ text: timeoutLog.executor.tag, iconURL: timeoutLog.executor.displayAvatarURL() })
            .setTimestamp();

        // eslint-disable-next-line no-empty-function
        const channel = await oldMember.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return oldMember.db_config.update({ log: false, logCh: null }, { where: { serverId: newMember.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => oldMember.db_config.update({ log: false, logCh: null }, { where: { serverId: newMember.guild.id } }));
    },
};