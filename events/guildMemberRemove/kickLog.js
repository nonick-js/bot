// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        const logModel = await require('../../models/log')(member.sequelize).findOne({ where: { serverId: member.guild.id } });
        if (!logModel.get('log') || !logModel.get('kick')) return;

        const auditLogs = await member.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberKick, limit: 3 }).catch(() => {});
        const kickLog = auditLogs?.entries?.find(v => v.target == member.user);
        if (!kickLog || kickLog?.createdAt < member.joinedAt) return;

        const channel = await member.guild.channels.fetch(logModel.get('logCh')).catch(() => {});

        try {
            if (!channel) throw '';
            if (!channel.permissionsFor(member.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.EmbedLinks)) throw '';
        } catch {
            return logModel.update({ log: false, logCh: null }).catch(() => {});
        }

        const embed = new discord.EmbedBuilder()
            .setTitle('🔨Kick')
            .setDescription(`${member.user} (\`${member.user.id}\`)`)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Orange')
            .setFields({ name: '理由', value: `\`\`\`${kickLog.reason ?? '入力されていません'}\`\`\`` })
            .setFooter({ text: kickLog.executor.tag, iconURL: kickLog.executor.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
    },
};