import { AuditLogEvent, ChannelType, Colors, EmbedBuilder, Events, formatEmoji, GuildAuditLogsEntry } from 'discord.js';
import { BlurpleEmojies, GrayEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const banLog = new DiscordEventBuilder({
  type: Events.GuildBanAdd,
  execute: async (ban) => {

    if (isBlocked(ban.guild)) return;

    const Setting = await ServerSettings.findOne({ serverId: ban.guild.id });
    const auditLog = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 3 })
      .then(logs => logs.entries.find(v => v?.target?.id == ban.user.id))
      .catch(() => undefined);

    if (!Setting?.log.ban.enable || !Setting?.log.ban.channel || !(auditLog instanceof GuildAuditLogsEntry)) return;

    const channel = await ban.guild.channels.fetch(Setting.log.ban.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      Setting.log.ban.enable = false;
      Setting.log.ban.channel = null;
      return Setting.save({ wtimeout: 1500 });
    }

    channel.send({ embeds: [
      new EmbedBuilder()
        .setTitle('`🔨` BAN')
        .setDescription([
          `${formatEmoji(GrayEmojies.member)} **対象者:** ${ban.user} [${ban.user.tag}]`,
          '',
          `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${auditLog.executor} [${auditLog.executor?.tag}]`,
          `${formatEmoji(BlurpleEmojies.text)} **理由:** ${ban.reason ?? '理由が入力されていません'}`,
        ].join('\n'))
        .setColor(Colors.Red)
        .setThumbnail(ban.user.displayAvatarURL())
        .setTimestamp(),
    ] })
    .catch(() => {});

  },
});

const unBanLog = new DiscordEventBuilder({
  type: Events.GuildBanRemove,
  execute: async (ban) => {

    if (isBlocked(ban.guild)) return;

    const Setting = await ServerSettings.findOne({ serverId: ban.guild.id });
    const auditLog = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 3 })
      .then(logs => logs.entries.find(v => v?.target?.id == ban.user.id))
      .catch(() => undefined);

      if (!Setting?.log.ban.enable || !Setting?.log.ban.channel || !(auditLog instanceof GuildAuditLogsEntry)) return;

    const channel = await ban.guild.channels.fetch(Setting.log.ban.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      await Setting.updateOne({ $set: { 'log.enable': false, 'log.channel': null } });
      return Setting.save({ wtimeout: 1500 });
    }

    channel
      .send({ embeds: [
        new EmbedBuilder()
          .setTitle('`🔨` BAN解除')
          .setDescription([
            `${formatEmoji(GrayEmojies.member)} **対象者:** ${ban.user} [${ban.user.tag}]`,
            '',
            `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${auditLog.executor} [${auditLog.executor?.tag}]`,
            `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
          ].join('\n'))
          .setColor(Colors.Blue)
          .setThumbnail(ban.user.displayAvatarURL())
          .setTimestamp(),
      ] })
      .catch(() => {});

  },
});

module.exports = [banLog, unBanLog];