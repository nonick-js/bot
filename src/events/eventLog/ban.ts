import { EventLogConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { textField, userField } from '@modules/fields';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  type GuildAuditLogsEntry,
  inlineCode,
} from 'discord.js';

const state = [
  AuditLogEvent.MemberBanAdd,
  AuditLogEvent.MemberBanRemove,
] as const;

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    if (!isBanLog(auditLogEntry)) return;
    const { executor, target, reason, actionType } = auditLogEntry;
    if (!(executor && target)) return;

    const isCancel = actionType === 'Create';
    const { ban: setting } =
      (await EventLogConfig.findOne({ guildId: guild.id })) ?? {};
    if (!(setting?.enabled && setting.channel)) return;
    const channel = await guild.channels.fetch(setting.channel);
    if (channel?.isTextBased()) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${inlineCode('🔨')} BAN${isCancel ? '解除' : ''}`)
            .setDescription(
              [
                userField(target, { label: '対象者' }),
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
            .setColor(isCancel ? Colors.Blue : Colors.Red)
            .setThumbnail(target.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    }
  },
});

function isBanLog(
  entry: GuildAuditLogsEntry,
): entry is GuildAuditLogsEntry<(typeof state)[number]> {
  return (state as unknown as AuditLogEvent[]).includes(entry.action);
}
