const { AuditLogEvent, EmbedBuilder, formatEmoji, inlineCode, Colors, codeBlock, Events } = require('discord.js');
const ConfigSchema = require('../schemas/configSchema');
const { isBlocked } = require('../utils/functions');

const kickLog = {
  name: Events.GuildMemberRemove,
  once: false,
  /** @param {import('discord.js').GuildMember} member */
  async execute(member) {
    if (isBlocked(member.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: member.guild.id });
    if (!GuildConfig?.log?.enable || !GuildConfig?.log?.category?.kick) return;

    const auditLogs = await member.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberKick,
      limit: 3,
    }).catch(() => {});

    const log = auditLogs?.entries?.find(v => v?.target?.id == member.user.id);
    if (!log || log?.createdAt < member.joinedAt) return;

    const channel = await member.guild.channels.fetch(GuildConfig.log.channel).catch(() => {});
    if (!channel) {
      await GuildConfig.updateOne({
        $set: {
          'log.enable': false,
          'log.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    const embed = new EmbedBuilder()
      .setTitle('`🔨` Kick')
      .setDescription([
        `**${member.user.tag}**`,
        `${formatEmoji('1005688192818761748')}ユーザーID: ${inlineCode(member.user.id)}`,
      ].join('\n'))
      .setThumbnail(member.user.displayAvatarURL())
      .setColor(Colors.Orange)
      .setFields({ name: '理由', value: codeBlock(log.reason ?? '入力されていません') })
      .setFooter({ text: log.executor.tag, iconURL: log.executor.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};

module.exports = [ kickLog ];