import { Emojis } from '@modules/constant';
import { DiscordEventBuilder } from '@modules/events';
import { getServerSetting } from '@modules/mongo/middleware';
import { AuditLogEvent, Colors, EmbedBuilder, Events, User, formatEmoji } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    if (auditLog.targetId === guild.client.user.id) return;
    if (!(auditLog.action === AuditLogEvent.MemberKick && auditLog.target instanceof User)) return;
    const { kick } = await getServerSetting(guild.id, 'log') ?? {};
    if (!(kick?.enable && kick.channel)) return;
    const channel = await guild.channels.fetch(kick.channel).catch(() => null);
    const executor = await auditLog.executor?.fetch();
    if (!channel?.isTextBased()) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🔨` Kick')
          .setDescription([
            `${formatEmoji(Emojis.Gray.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
            '',
            `${formatEmoji(Emojis.Blurple.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
            `${formatEmoji(Emojis.Blurple.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
          ].join('\n'))
          .setColor(Colors.Orange)
          .setThumbnail(auditLog.target.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
});