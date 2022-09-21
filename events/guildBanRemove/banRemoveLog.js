// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {guildBanRemoveCallback} */
    async execute(ban) {
        const logModel = await require('../../models/log')(ban.sequelize).findOne({ where: { serverId: ban.guild.id } });
        if (!logModel?.get('log') || !logModel?.get('ban')) return;

        const auditLogs = await ban.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberBanRemove, limit: 3 }).catch(() => {});
        const banLog = auditLogs?.entries?.find(v => v.target == ban.user);
        if (!banLog) return;

        const channel = await ban.guild.channels.fetch(logModel.get('logCh')).catch(() => {});

        try {
            if (!channel) throw '';
            if (!channel.permissionsFor(ban.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel, discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.EmbedLinks)) throw '';
        } catch {
            return logModel.update({ log: false, logCh: null }).catch(() => {});
        }

        const embed = new discord.EmbedBuilder()
            .setTitle('🔨BAN解除')
            .setDescription(`${ban.user} (\`${ban.user.id}\`)`)
            .setThumbnail(ban.user.displayAvatarURL())
            .setColor('Blue')
            .setFooter({ text: banLog.executor.tag, iconURL: banLog.executor.displayAvatarURL() })
            .setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
    },
};