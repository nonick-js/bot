import { AuditLogEvent, ChannelType, Colors, EmbedBuilder, Events, formatEmoji, GuildAuditLogsEntry } from 'discord.js';
import { GrayEmojies, BlurpleEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const kickLog = new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  execute: async (member) => {

    if (isBlocked(member.guild)) return;

    const Setting = await ServerSettings.findOne({ serverId: member.guild.id });
    const auditLog = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 3 })
      .then(logs => logs.entries.find(v => v.target?.id == member.user.id))
      .catch(() => undefined);

    if (!Setting?.log.kick.enable || !Setting?.log.kick.channel) return;
    if (!(auditLog instanceof GuildAuditLogsEntry) || !member.joinedAt || auditLog.createdAt < member.joinedAt) return;

    const channel = await member.guild.channels.fetch(Setting.log.kick.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      Setting.log.kick.enable = false;
      Setting.log.kick.channel = null;
      return Setting.save({ wtimeout: 1500 });
    }

    channel.send({ embeds: [
      new EmbedBuilder()
        .setTitle('`🔨` Kick')
        .setDescription([
          `${formatEmoji(GrayEmojies.member)} **対象者:** ${member} [${member.user.tag}]`,
          '',
          `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${auditLog.executor} [${auditLog.executor?.tag}]`,
          `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
        ].join('\n'))
        .setColor(Colors.Orange)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp(),
    ] })
    .catch(() => {});

  },
});

module.exports = [kickLog];