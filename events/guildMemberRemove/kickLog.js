const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

module.exports = {
	/** @param {discord.GuildMember} member */
	async execute(member) {
		const Config = await Configs.findOne({ serverId: member.guild.id });
		const log = Config.log;
		if (!log.enable || !log.category.kick) return;

		const auditLogs = await member.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberKick, limit: 3 }).catch(() => {});
		const kickLog = auditLogs?.entries?.find(v => v.target == member.user);
		if (!kickLog || kickLog?.createdAt < member.joinedAt) return;

		const channel = await member.guild.channels.fetch(log.channel).catch(() => {});
		if (!channel) {
			log.enable = false;
			log.channel = null;
			return Config.save({ wtimeout: 1500 });
		}

		const embed = new discord.EmbedBuilder()
			.setTitle('🔨Kick')
			.setDescription(`${member.user} (\`${member.user.id}\`)`)
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('Orange')
			.setFields({ name: '理由', value: `\`\`\`${kickLog.reason ?? '入力されていません'}\`\`\`` })
			.setFooter({ text: kickLog.executor.tag, iconURL: kickLog.executor.displayAvatarURL() })
			.setTimestamp();

		channel.send({ embeds: [embed] }).catch(() => {});
	},
};