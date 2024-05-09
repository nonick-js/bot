import { EventLogConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { textField, userField } from '@modules/fields';
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
    const { kick: setting } =
      (await EventLogConfig.findOne({ guildId: guild.id })) ?? {};
    if (!(setting?.enabled && setting.channel)) return;
    const channel = await guild.channels.fetch(setting.channel);
    if (channel?.isTextBased()) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` Kick')
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
            .setColor(Colors.Orange)
            .setThumbnail(target.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    }
  },
});
