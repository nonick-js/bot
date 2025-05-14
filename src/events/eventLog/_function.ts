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

export async function sendLogToRelatedReport(
  guild: Guild,
  user: User,
  message: Message | null,
  messageOptions: BaseMessageOptions,
) {
  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });
  if (!setting?.channel || !setting.showModerateLog) return;

  const channel = await guild.channels.fetch(setting.channel).catch(() => null);
  if (!channel) return;
  if (
    !(
      channel.type === ChannelType.GuildText ||
      channel.type === ChannelType.GuildForum
    )
  )
    return;

  const reports = await db.query.report.findMany({
    where: (report, { eq, and }) =>
      and(
        eq(report.guildId, guild.id),
        eq(report.targetUserId, user.id),
        eq(report.channelId, channel.id),
        message
          ? and(
              eq(report.targetChannelId, message.channelId),
              eq(report.targetMessageId, message.id),
            )
          : undefined,
      ),
  });

  for (const r of reports) {
    const thread = await channel.threads.fetch(r.threadId).catch(() => null);
    const starterMesasge = await thread
      ?.fetchStarterMessage()
      .catch(() => null);

    if (
      !thread ||
      (channel.type === ChannelType.GuildText && !starterMesasge)
    ) {
      return await db.delete(report).where(eq(report.id, r.id));
    }
    if (!thread.isSendable()) return;

    thread.send(messageOptions);
  }
}

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
