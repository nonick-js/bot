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
        if (!newMember.communicationDisabledUntil || oldMember.communicationDisabledUntil == newMember.communicationDisabledUntil) return;

        const config = await oldMember.db_config.findOne({ where: { serverId: newMember.guild.id } });
        const logConfig = await oldMember.db_logConfig.findOne({ where: { serverId: newMember.guild.id } });

        if (!config.get('log') || !logConfig.get('timeout')) return;
        // eslint-disable-next-line no-empty-function
        const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate }).catch(() => {});
        const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
        if (!timeoutLog) return;

        const embed = new discord.EmbedBuilder()
            .setTitle('⛔タイムアウト')
            .setDescription(`${newMember.user} (\`${newMember.user.id}\`)`)
            .setColor('Red')
            .setThumbnail(newMember.displayAvatarURL())
            .setFields(
                { name: '理由', value: `\`\`\`${timeoutLog.reason ?? '入力されていません'}\`\`\`` },
                { name: '解除される時間', value: `${discord.time(Math.round(newMember.communicationDisabledUntilTimestamp / 1000), 'f')} (${discord.time(Math.round(newMember.communicationDisabledUntilTimestamp / 1000), 'R')})` },
            )
            .setFooter({ text: timeoutLog.executor.tag, iconURL: timeoutLog.executor.displayAvatarURL() })
            .setTimestamp();

        // eslint-disable-next-line no-empty-function
        const channel = await oldMember.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return oldMember.db_config.update({ log: false, logCh: null }, { where: { serverId: newMember.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => oldMember.db_config.update({ log: false, logCh: null }, { where: { serverId: newMember.guild.id } }));
    },
};