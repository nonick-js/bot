import { Emojis } from '@modules/constant';
import { DiscordEventBuilder } from '@modules/events';
import { getServerSetting } from '@modules/mongo/middleware';
import { AuditLogEvent, Colors, EmbedBuilder, Events, User, formatEmoji } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  execute: async (auditLog, guild) => {
    if (![
      AuditLogEvent.MemberBanAdd,
      AuditLogEvent.MemberBanRemove,
    ].includes(auditLog.action) || !(auditLog.target instanceof User)) return;

    const setting = await getServerSetting(guild.id, 'log');
    if (!setting?.ban.enable || !setting.ban.channel) return;

    const channel = await guild.channels.fetch(setting.ban.channel).catch(() => null);
    if (!channel?.isTextBased()) return;
    const executor = await auditLog.executor?.fetch();

    if (auditLog.action === AuditLogEvent.MemberBanAdd) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.id}\`]`,
              '',
              `${formatEmoji(Emojis.Blurple.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(Emojis.Blurple.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Red)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(console.error);
    }
    else if (auditLog.action === AuditLogEvent.MemberBanRemove) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` BAN解除')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              '',
              `${formatEmoji(Emojis.Blurple.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(Emojis.Blurple.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Blue)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(console.error);
    }
  },
});