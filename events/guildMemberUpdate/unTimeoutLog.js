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
        if (!oldMember?.communicationDisabledUntil || newMember?.communicationDisabledUntil || oldMember?.communicationDisabledUntil == newMember?.communicationDisabledUntil) return;

        const logModel = await require('../../models/log')(oldMember.sequelize).findOne({ where: { serverId: newMember.guild.id } });
        if (!logModel.get('log') || !logModel.get('timeout')) return;

        const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate, limit: 3 }).catch(() => {});
        const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
        if (!timeoutLog) return;

        const channel = await oldMember.guild.channels.fetch(logModel.get('logCh')).catch(() => {});

        try {
            if (!channel) throw '';
            if (!channel.permissionsFor(newMember.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.EmbedLinks)) throw '';
        } catch {
            return logModel.update({ log: false, logCh: null }).catch(() => {});
        }

        const embed = new discord.EmbedBuilder()
            .setTitle('⛔タイムアウト手動解除')
            .setDescription(`${newMember.user} (\`${newMember.user.id}\`)`)
            .setColor('Blue')
            .setThumbnail(newMember.displayAvatarURL())
            .setFooter({ text: timeoutLog.executor.tag, iconURL: timeoutLog.executor.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
    },
};