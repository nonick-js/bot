import { dashboard } from '@const/links';
import { report } from '@database/src/schema/report';
import type { reportSetting } from '@database/src/schema/setting';
import { db } from '@modules/drizzle';
import {
  type BaseMessageOptions,
  ChannelType,
  type Guild,
  type GuildBasedChannel,
  type Message,
  MessageContextMenuCommandInteraction,
  type ModalSubmitInteraction,
  PermissionFlagsBits,
  type User,
  UserContextMenuCommandInteraction,
  hyperlink,
} from 'discord.js';
import { eq } from 'drizzle-orm';

export async function isReportable(
  interaction:
    | MessageContextMenuCommandInteraction<'cached'>
    | UserContextMenuCommandInteraction<'cached'>,
): Promise<{ ok: false; reason: string } | { ok: true; reason?: string }> {
  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });

  const channelId = getReportChannelId(setting);

  if (!setting || !channelId) {
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return {
        ok: false,
        reason: `\`❌\` この機能を使用するには、ダッシュボードで${hyperlink('報告を受け取るチャンネルを設定', `<${dashboard}/guilds/${interaction.guild.id}/report>`)}する必要があります。`,
      };
    }
    return {
      ok: false,
      reason:
        '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
    };
  }

  const targetUser =
    interaction instanceof UserContextMenuCommandInteraction
      ? interaction.targetUser
      : interaction.targetMessage.author;
  const targetMember = await interaction.guild.members
    .fetch(targetUser.id)
    .catch(() => null);

  if (targetUser.id === interaction.user.id) {
    return { ok: false, reason: '`❌` 自分自身を報告しようとしています。' };
  }
  if (
    targetUser.system ||
    targetUser.bot ||
    targetUser.id === interaction.client.user.id
  ) {
    return {
      ok: false,
      reason: '`❌` このユーザーを通報することはできません。',
    };
  }
  if (
    !setting.includeModerator &&
    targetMember?.permissions.has(PermissionFlagsBits.ModerateMembers)
  ) {
    return {
      ok: false,
      reason: '`❌` モデレーターを通報することはできません。',
    };
  }

  if (interaction instanceof MessageContextMenuCommandInteraction) {
    const targetMessage = interaction.targetMessage;
    if (targetMessage.webhookId) {
      return { ok: false, reason: '`❌` Webhookを報告することはできません。' };
    }
  }

  return { ok: true };
}

export async function isSendableReport(
  interaction: ModalSubmitInteraction,
  channel: GuildBasedChannel | null,
): Promise<{ ok: false; reason: string } | { ok: true; reason?: string }> {
  if (!channel)
    return {
      ok: false,
      reason: '',
    };
  if (
    !channel
      ?.permissionsFor(interaction.client.user)
      ?.has([
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.SendMessagesInThreads,
        PermissionFlagsBits.ManageThreads,
        PermissionFlagsBits.CreatePublicThreads,
      ])
  ) {
    return {
      ok: false,
      reason:
        '`❌` 送信先のチャンネルの権限が不足していたため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
    };
  }
  return { ok: true };
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
    where: (report, { eq, and, isNull }) =>
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

export function getReportChannelId(
  setting?: typeof reportSetting.$inferSelect,
) {
  if (!setting) return null;
  const type = setting?.channelType;

  switch (type) {
    case 'forum':
      return setting?.forumChannel;
    case 'text':
      return setting?.channel;
    default:
      return null;
  }
}

export const sendReportRequirePerissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.SendMessagesInThreads,
  PermissionFlagsBits.ManageThreads,
  PermissionFlagsBits.CreatePublicThreads,
];
