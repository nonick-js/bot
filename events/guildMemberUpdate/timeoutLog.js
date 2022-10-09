const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

module.exports = {
	/**
	 * @param {discord.GuildMember} oldMember
	 * @param {discord.GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		if (!newMember?.communicationDisabledUntilTimestamp || oldMember?.communicationDisabledUntilTimestamp == newMember?.communicationDisabledUntilTimestamp) return;

		const Config = await Configs.findOne({ serverId: oldMember.guild.id });
		const log = Config?.log;
		if (!log?.enable || !log?.category?.timeout) return;

		const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate, limit: 3 }).catch(() => {});
		const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
		if (!timeoutLog) return;

		const channel = await newMember.guild.channels.fetch(log.channel).catch(() => {});
		if (!channel) {
			log.enable = false;
			log.channel = null;
			return Config.save({ wtimeout: 1500 });
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

		channel.send({ embeds: [embed] }).catch(() => {});
	},
};