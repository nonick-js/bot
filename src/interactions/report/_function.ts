import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import {
  type BaseMessageOptions,
  ChannelType,
  type Guild,
  type Message,
  type User,
} from 'discord.js';
import { eq } from 'drizzle-orm';

export async function sendToOpenedReport(
  { guild, user, message }: { guild: Guild; user: User; message?: Message },
  logMessageOptions: BaseMessageOptions,
) {
  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });
  if (!setting?.showModerateLog) return;

  const reports = await db.query.report.findMany({
    where: (report, { eq, and }) =>
      and(
        eq(report.guildId, guild.id),
        eq(report.targetUserId, user.id),
        message
          ? and(
              eq(report.targetChannelId, message.channelId),
              eq(report.targetMessageId, message.id),
            )
          : undefined,
      ),
  });

  for (const targetReport of reports) {
    if (targetReport.channelId !== setting.channel) return;

    const channel = await guild.channels
      .fetch(targetReport.channelId)
      .catch(() => null);
    if (
      channel?.type !== ChannelType.GuildText &&
      channel?.type !== ChannelType.GuildForum
    )
      return;

    const thread = await channel.threads
      .fetch(targetReport.threadId)
      .catch(() => null);
    const starterMessage = await thread
      ?.fetchStarterMessage()
      .catch(() => null);

    // メッセージやスレッドが存在しない場合は強制的にcloseする
    if (
      !thread ||
      (channel.type === ChannelType.GuildText && !starterMessage)
    ) {
      return await db.delete(report).where(eq(report.id, targetReport.id));
    }

    thread.send(logMessageOptions);
  }
}
