const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

module.exports = {
	/**
	 * @param {discord.GuildMember} oldMember
	 * @param {discord.GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		if (!oldMember?.communicationDisabledUntilTimestamp || newMember?.communicationDisabledUntilTimestamp || oldMember?.communicationDisabledUntilTimestamp == newMember?.communicationDisabledUntilTimestamp) return;

		const Config = await Configs.findOne({ serverId: oldMember.guild.id });
		const log = Config?.log;
		if (!log?.enable || !log?.category?.timeout) return;

		const auditLogs = await newMember.guild.fetchAuditLogs({ type: discord.AuditLogEvent.MemberUpdate, limit: 3 }).catch(() => {});
		const timeoutLog = auditLogs?.entries?.find(v => v.target == newMember.user);
		if (!timeoutLog) return;

		const channel = await oldMember.guild.channels.fetch(log.channel).catch(() => {});
		if (!channel)	{
			log.enable = false;
			log.channel = null;
			return Config.save({ wtimeout: 1500 });
		}

		const embed = new discord.EmbedBuilder()
			.setTitle('⛔タイムアウト手動解除')
			.setDescription(`${newMember.user} (\`${newMember.user.id}\`)`)
			.setColor('Blue')
			.setThumbnail(newMember.displayAvatarURL())
			.setFooter({ text: timeoutLog.executor.tag, iconURL: timeoutLog.executor.displayAvatarURL() })
			.setTimestamp();

		channel.send({ embeds: [embed] }).catch(() => {});
	},
};