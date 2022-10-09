const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

module.exports = {
	/** @param {discord.GuildMember} member*/
  async execute(ban) {
    const Config = await Configs.findOne({ serverId: ban.guild.id });
    const log = Config?.log;

    if (!log?.enable || !log?.category?.ban) return;

    const auditLogs = await ban.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberBanRemove, limit: 3 }).catch(() => {});
    const banLog = auditLogs?.entries?.find(v => v.target == ban.user);
    if (!banLog) return;

    const channel = await ban.guild.channels.fetch(log.channel).catch(() => {});

		if (!channel) {
			log.enable = false;
			log.channel = null;
			return Config.save({ wtimeout: 1500 });
		}

		const embed = new discord.EmbedBuilder()
				.setTitle('🔨BAN解除')
				.setDescription(`${ban.user} (\`${ban.user.id}\`)`)
				.setThumbnail(ban.user.displayAvatarURL())
				.setColor('Blue')
				.setFooter({ text: banLog.executor.tag, iconURL: banLog.executor.displayAvatarURL() })
				.setTimestamp();

		channel.send({ embeds: [embed] }).catch(() => {});
  },
};