const { Events, AuditLogEvent, PermissionFlagsBits, EmbedBuilder, formatEmoji, inlineCode, Colors, codeBlock, time } = require('discord.js');
const ConfigSchema = require('../schemas/configSchema');
const { isBlocked } = require('../utils/functions');

const timeoutLog = {
  name: Events.GuildMemberUpdate,
  once: false,
  /**
	 * @param {import('discord.js').GuildMember} oldMember
	 * @param {import('discord.js').GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
    if (
      !isBlocked(newMember.guild) ||
      !newMember.communicationDisabledUntilTimestamp ||
      oldMember.communicationDisabledUntilTimestamp == newMember.communicationDisabledUntilTimestamp ||
      newMember.communicationDisabledUntilTimestamp < Date.now()
    ) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: newMember.guild.id });
    if (!GuildConfig.log.enable || !GuildConfig.log.category.timeout) return;

    const auditLogs = await newMember.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberUpdate,
      limit: 3,
    }).catch(() => {});

		const log = auditLogs?.entries?.find(v => v?.target?.id == newMember.user.id);
    if (!log) return;

    const channel = await oldMember.guild.channels.fetch(GuildConfig.log.channel).catch(() => {});
    if (
      !channel.permissionsFor(newMember.guild.members.me)
        ?.has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel)
    ) {
      await GuildConfig.updateOne({
        $set: {
          'log.enable': false,
          'log.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    const embed = new EmbedBuilder()
      .setTitle('`⛔` タイムアウト')
      .setDescription([
        `**${newMember.user.tag}**`,
        `${formatEmoji('1005688192818761748')}ユーザーID: ${inlineCode(newMember.user.id)}`,
      ].join('\n'))
      .setThumbnail(newMember.user.displayAvatarURL())
      .setColor(Colors.Red)
      .setFields(
        { name: '理由', value: codeBlock(log.reason ?? '入力されていません') },
        { name: '解除される時間', value: time(Math.round(newMember.communicationDisabledUntilTimestamp / 1000), 'f') },
      )
      .setFooter({ text: log.executor.tag, iconURL: log.executor.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};

const unTimeoutLog = {
  name: Events.GuildMemberUpdate,
  once: false,
  /**
	 * @param {import('discord.js').GuildMember} oldMember
	 * @param {import('discord.js').GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
    if (
      !isBlocked(newMember.guild) ||
      !oldMember.communicationDisabledUntilTimestamp ||
      newMember.communicationDisabledUntilTimestamp ||
      oldMember.communicationDisabledUntilTimestamp == newMember.communicationDisabledUntilTimestamp
    ) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: newMember.guild.id });
    if (!GuildConfig.log.enable || !GuildConfig.log.category.timeout) return;

    const auditLogs = await newMember.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberUpdate,
      limit: 3,
    }).catch(() => {});

    const log = auditLogs?.entries?.find(v => v?.target?.id == newMember.user.id);
    if (!log) return;

    const channel = await newMember.guild.channels.fetch(GuildConfig.log.channel).catch(() => {});
    if (
      channel?.permissionsFor(newMember.guild.members.me)
        ?.has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel)
    ) {
      GuildConfig.updateOne({
        $set: {
          'log.enable': false,
          'log.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    const embed = new EmbedBuilder()
      .setTitle('`⛔` タイムアウト手動解除')
      .setDescription([
        `**${newMember.user.tag}**`,
        `${formatEmoji('1005688192818761748')}ユーザーID: ${inlineCode(newMember.user.id)}`,
      ].join('\n'))
      .setThumbnail(newMember.user.displayAvatarURL())
      .setColor(Colors.Blue)
      .setFooter({ text: log.executor.tag, iconURL: log.executor.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};

module.exports = [ timeoutLog, unTimeoutLog ];