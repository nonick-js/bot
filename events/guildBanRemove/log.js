// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {guildBanRemoveCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const logConfig = await member.db_logConfig.findOne({ where: { serverId: member.guild.id } });

        if (!config.get('log') || !logConfig.get('ban')) return;
        const auditLogs = await member.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberBanRemove });
        const banLog = auditLogs.entries.find(v => v.target == member.user);

        const embed = new discord.EmbedBuilder()
            .setTitle('BAN解除')
            .setDescription(`${member.user} \`${member.user.id}\``)
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Blue')
            .setFooter({ text: banLog.executor.tag, iconURL: banLog.executor.displayAvatarURL() });

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(config.get('logCh')).catch(() => {});
        if (!channel) return member.db_config.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } });

        channel.send({ embeds: [embed] }).catch(() => member.db_config.update({ log: false, logCh: null }, { where: { serverId: member.guild.id } }));
    },
};