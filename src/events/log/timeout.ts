import { AuditLogEvent, ChannelType, Colors, EmbedBuilder, Events, formatEmoji, GuildAuditLogsEntry, time } from 'discord.js';
import { BlurpleEmojies, GrayEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const timeoutLog = new DiscordEventBuilder({
  type: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {

    if (isBlocked(newMember.guild) || !newMember) return;

    if (
      oldMember.communicationDisabledUntilTimestamp == newMember.communicationDisabledUntilTimestamp ||
      (newMember.communicationDisabledUntilTimestamp && newMember.communicationDisabledUntilTimestamp < (Date.now() / 1000))
    ) return;

    const Setting = await ServerSettings.findOne({ serverId: newMember.guild.id });
    const auditLog = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 3 })
      .then(logs => logs.entries.find(v => v?.target?.id == newMember.user.id))
      .catch(() => undefined);

    if (!Setting?.log.timeout.enable || !Setting?.log.timeout.channel || !(auditLog instanceof GuildAuditLogsEntry)) return;

    const channel = await newMember.guild.channels.fetch(Setting?.log.timeout.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      Setting.log.timeout.enable = false;
      Setting.log.timeout.channel = null;
      Setting.save({ wtimeout: 1500 });
      return;
    }

    if (newMember.communicationDisabledUntilTimestamp) {
      channel
        .send({ embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${newMember} [${newMember.user.tag}]`,
              `${formatEmoji(GrayEmojies.schedule)} **解除される時間:** ${time(Math.floor(newMember.communicationDisabledUntilTimestamp / 1000), 'f')}`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${auditLog.executor} [${auditLog.executor?.tag}]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Red)
            .setThumbnail(newMember.user.displayAvatarURL())
            .setTimestamp(),
        ] })
        .catch(() => {});
    }
    else if (oldMember.communicationDisabledUntilTimestamp && !newMember.communicationDisabledUntilTimestamp) {
      channel
        .send({ embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト手動解除')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${newMember} [${newMember.user.tag}]`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${auditLog.executor} [${auditLog.executor?.tag}]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Blue)
            .setThumbnail(newMember.user.displayAvatarURL())
            .setTimestamp(),
        ] })
        .catch(() => {});
    }

  },
});

module.exports = [timeoutLog];