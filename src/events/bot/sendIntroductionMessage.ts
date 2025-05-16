import { DiscordEventBuilder } from '@modules/events';
import { AuditLogEvent, Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildCreate,
  async execute(guild) {
    const auditLogs = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.BotAdd,
      })
      .catch(() => null);
    if (!auditLogs) return;

    const entry = auditLogs.entries.first();
    if (!entry || entry.targetId !== guild.client.user.id) return;

    entry.executor?.send({
      content: 'BOTの導入を検知しました',
    });
  },
});
