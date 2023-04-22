import { AuditLogEvent, Colors, EmbedBuilder, Events, formatEmoji, User } from 'discord.js';
import { Emojis, Fields } from '../../module/constant';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';

const banLog = new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  execute: async (auditLog, guild) => {
    if (isBlocked(guild) || auditLog.targetId === guild.client.user.id) return;
    if (![AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberBanRemove].includes(auditLog.action) || !(auditLog.target instanceof User)) return;

    const setting = await getServerSetting(guild.id, 'log');
    if (!setting?.ban.enable || !setting?.ban.channel) return;

    const channel = await guild.channels.fetch(setting.ban.channel).catch(() => null);
    const executor = await auditLog.executor?.fetch();

    if (!channel?.isTextBased()) return;

    if (auditLog.action === AuditLogEvent.MemberBanAdd) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN')
            .setDescription(Fields.multiLine(
              Fields.memberId(auditLog.target, { text: '対象者' }),
              '',
              Fields.memberTag(executor, { text: '実行者', color: 'Blurple' }),
              `${formatEmoji(Emojis.Blurple.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ))
            .setColor(Colors.Red)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });
    }

    else if (auditLog.action === AuditLogEvent.MemberBanRemove) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN解除')
            .setDescription(Fields.multiLine(
              Fields.memberId(auditLog.target, { text: '対象者' }),
              '',
              Fields.memberTag(executor, { text: '実行者', color: 'Blurple' }),
              `${formatEmoji(Emojis.Blurple.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ))
            .setColor(Colors.Blue)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });
    }
  },
});

export default [banLog];