import { EventLogConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { scheduleField, textField, userField } from '@modules/fields';
import { getSendableChannel } from '@modules/util';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  type GuildAuditLogsEntry,
  inlineCode,
} from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    if (auditLogEntry.action !== AuditLogEvent.MemberUpdate) return;
    const timeoutChange = auditLogEntry.changes.find(
      (v) => v.key === 'communication_disabled_until',
    );
    if (!timeoutChange) return;
    const { executor, target, reason } =
      auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.MemberUpdate>;
    if (!(executor && target)) return;
    const member = await guild.members.fetch(target).catch(() => null);
    if (!member) return;

    const isCancel =
      Date.parse((timeoutChange.new ?? 0) as string) <= Date.now();
    const { timeout: setting } =
      (await EventLogConfig.findOne({ guildId: guild.id })) ?? {};
    if (!(setting?.enabled && setting.channel)) return;
    const channel = await getSendableChannel(guild, setting.channel).catch(
      () => {
        EventLogConfig.updateOne(
          { guildId: guild.id },
          { $set: { timeout: { enabled: false, channel: null } } },
        );
      },
    );
    if (!channel) return;
    const field = [
      userField(target, { label: '対象者' }),
      scheduleField(member.communicationDisabledUntil ?? 0, {
        label: '解除される時間',
      }),
      '',
      userField(await executor.fetch(), {
        label: '実行者',
        color: 'blurple',
      }),
      textField(reason ?? '理由が入力されてません', {
        label: '理由',
        color: 'blurple',
      }),
    ];
    if (isCancel) field.splice(1, 1);
    channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('🛑')} タイムアウト${isCancel ? '解除' : ''}`)
          .setDescription(field.join('\n'))
          .setColor(isCancel ? Colors.Blue : Colors.Red)
          .setThumbnail(target.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
});
