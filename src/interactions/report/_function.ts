import { blurple } from '@const/emojis';
import { dashboard } from '@const/links';
import { db } from '@modules/drizzle';
import { userField } from '@modules/fields';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type GuildBasedChannel,
  MessageContextMenuCommandInteraction,
  type ModalSubmitInteraction,
  PermissionFlagsBits,
  TextDisplayBuilder,
  UserContextMenuCommandInteraction,
  escapeMarkdown,
  hyperlink,
} from 'discord.js';

export async function isReportable(
  interaction:
    | MessageContextMenuCommandInteraction<'cached'>
    | UserContextMenuCommandInteraction<'cached'>,
): Promise<{ ok: false; reason: string } | { ok: true; reason?: string }> {
  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });

  if (!setting?.channel) {
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

export function reportAuthorTextDisplay(
  interaction: ModalSubmitInteraction<'cached'>,
) {
  return new TextDisplayBuilder().setContent(
    [
      userField(interaction.user, {
        color: 'blurple',
        label: '報告者',
      }),
      `${formatEmoji(blurple.text)} **報告理由:** ${escapeMarkdown(interaction.components[0].components[0].value)}`,
    ].join('\n'),
  );
}

export const progressButtonActionRow =
  new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:report-completed')
      .setLabel('対応済みにする')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('nonick-js:report-ignore')
      .setLabel('無視')
      .setStyle(ButtonStyle.Secondary),
  );
