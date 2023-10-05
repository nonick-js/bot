import { Emojis } from '@modules/constant';
import { DiscordEventBuilder } from '@modules/events';
import { getServerSetting } from '@modules/mongo/middleware';
import { AuditLogEvent, Colors, EmbedBuilder, Events, GuildMember, User, formatEmoji, time } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    if (!(auditLog.action === AuditLogEvent.MemberUpdate && auditLog.target instanceof User)) return;

    const change = auditLog.changes.find(v => v.key === 'communication_disabled_until');
    if (!change) return;
    const { timeout } = await getServerSetting(guild.id, 'log') ?? {};
    if (!(timeout?.enable && timeout.channel)) return;
    const channel = await guild.channels.fetch(timeout.channel).catch(() => null);
    const member = await guild.members.fetch(auditLog.target).catch(() => null);
    const executor = await auditLog.executor?.fetch();

    if (!(channel?.isTextBased() && member instanceof GuildMember)) return;
    if (typeof change.new === 'string' && Date.parse(change.new) > Date.now()) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              `${formatEmoji(Emojis.Gray.schedule)} **解除される時間:** ${time(member.communicationDisabledUntil ?? new Date())}`,
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
    else {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト手動解除')
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