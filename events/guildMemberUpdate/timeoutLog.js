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
        if (!newMember?.communicationDisabledUntil || oldMember?.communicationDisabledUntilTimestamp == newMember?.communicationDisabledUntilTimestamp) return;

        const logModel = await require('../../models/log')(oldMember.sequelize).findOne({ where: { serverId: newMember.guild.id } });
        if (!logModel?.get('log') || !logModel?.get('timeout')) return;

        const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate, limit: 3 }).catch(() => {});
        const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
        if (!timeoutLog) return;

        const channel = await newMember.guild.channels.fetch(logModel.get('logCh')).catch(() => {});

        try {
            if (!channel) throw '';
            if (!channel.permissionsFor(newMember.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.EmbedLinks)) throw '';
        } catch {
            return logModel.update({ log: false, logCh: null }).catch(() => {});
        }

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

        channel.send({ embeds: [embed] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
    },
};