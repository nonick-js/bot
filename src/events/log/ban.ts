import { AuditLogEvent, ChannelType, Colors, EmbedBuilder, Events, formatEmoji, User } from 'discord.js';
import { BlurpleEmojies, GrayEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const banLog = new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  execute: async (auditLog, guild) => {

    if (isBlocked(guild)) return;
    if (![AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberBanRemove].includes(auditLog.action) || !(auditLog.target instanceof User)) return;

    const Setting = await ServerSettings.findOne({ serverId: guild.id });

    if (!Setting?.log.ban.enable || !Setting.log.ban.channel) return;

    const channel = await guild.channels.fetch(Setting.log.ban.channel).catch(() => null);
    const executor = await auditLog.executor?.fetch();

    if (channel?.type !== ChannelType.GuildText) return;

    if (auditLog.action === AuditLogEvent.MemberBanAdd)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.id}\`]`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Red)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });

    else if (auditLog.action === AuditLogEvent.MemberBanRemove)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN解除')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Blue)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });

  },
});

module.exports = [banLog];