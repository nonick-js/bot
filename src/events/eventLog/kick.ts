import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { textField, userField } from '@modules/fields';
import { getSendableChannel } from '@modules/util';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  type GuildAuditLogsEntry,
} from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    if (auditLogEntry.action !== AuditLogEvent.MemberKick) return;
    const { executor, target, reason } =
      auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.MemberKick>;
    if (!(executor && target)) return;
    const setting = await db.query.kickLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guild.id),
    });
    if (!(setting?.enabled && setting.channel)) return;
    const channel = await getSendableChannel(guild, setting.channel).catch(
      () => null,
    );
    if (!channel) return;
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🔨` Kick')
          .setDescription(
            [
              userField(await target.fetch(), { label: '対象者' }),
              '',
              userField(await executor.fetch(), {
                label: '実行者',
                color: 'blurple',
              }),
              textField(reason ?? '理由が入力されてません', {
                label: '理由',
                color: 'blurple',
              }),
            ].join('\n'),
          )
          .setColor(Colors.Orange)
          .setThumbnail(target.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
});
