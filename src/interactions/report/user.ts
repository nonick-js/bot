import { Modal, UserContext } from '@akki256/discord-interaction';
import { blurple, red } from '@const/emojis';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import { scheduleField, userField } from '@modules/fields';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ContainerBuilder,
  type ForumThreadChannel,
  type MessageCreateOptions,
  MessageFlags,
  ModalBuilder,
  type PublicThreadChannel,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
  ThumbnailBuilder,
  escapeMarkdown,
  roleMention,
} from 'discord.js';
import {
  getReportChannelId,
  isReportable,
  sendReportRequirePerissions,
} from './_function';

const userContext = new UserContext(
  {
    name: 'ユーザーを報告',
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const { ok, reason } = await isReportable(interaction);
    if (!ok) {
      return interaction.reply({
        content: reason,
        ephemeral: true,
      });
    }

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:userReportModal')
        .setTitle('ユーザーを報告')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId(interaction.targetId)
              .setLabel('詳細')
              .setPlaceholder(
                '送信した報告はサーバーの運営のみ公開され、DiscordのTrust&Safetyには報告されません。',
              )
              .setMaxLength(1500)
              .setStyle(TextInputStyle.Paragraph),
          ),
        ),
    );
  },
);

const userReportModal = new Modal(
  {
    customId: 'nonick-js:userReportModal',
  },
  async (interaction) => {
    if (!(interaction.inCachedGuild() && interaction.channel)) return;

    const setting = await db.query.reportSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });
    const channelId = getReportChannelId(setting);

    if (!setting || !channelId) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルが存在しないため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }

    const targetUser = await interaction.client.users
      .fetch(interaction.components[0].components[0].customId)
      .catch(() => null);
    const channel = await interaction.guild.channels
      .fetch(channelId)
      .catch(() => null);

    if (!channel) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルが存在しないため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }
    if (!targetUser)
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });
    if (
      !channel
        ?.permissionsFor(interaction.client.user)
        ?.has(sendReportRequirePerissions)
    ) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルの権限が不足していたため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }

    const reportMessageOptions: MessageCreateOptions = {
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              `## ${formatEmoji(red.flag)} ユーザーの報告`,
            ),
          ])
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
          )
          .addSectionComponents([
            new SectionBuilder()
              .addTextDisplayComponents([
                new TextDisplayBuilder().setContent('### ユーザーの情報'),
                new TextDisplayBuilder().setContent(
                  [
                    userField(targetUser, { label: 'ユーザー' }),
                    scheduleField(targetUser.createdAt, {
                      label: 'アカウント作成日',
                    }),
                  ].join('\n'),
                ),
              ])
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(targetUser.displayAvatarURL()),
              ),
          ])
          .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
          )
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              [
                userField(interaction.user, {
                  color: 'blurple',
                  label: '報告者',
                }),
                `${formatEmoji(blurple.text)} **報告理由:** ${escapeMarkdown(interaction.components[0].components[0].value)}`,
              ].join('\n'),
            ),
          ]),
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:report-completed')
            .setLabel('対応済みにする')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('nonick-js:report-ignore')
            .setLabel('無視')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:report-delete')
            .setLabel('削除')
            .setStyle(ButtonStyle.Danger),
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {
        parse: ['roles'],
      },
    };

    try {
      let createdThread: PublicThreadChannel | ForumThreadChannel | null = null;

      if (channel?.type === ChannelType.GuildText) {
        createdThread = await channel.send(reportMessageOptions).then((msg) =>
          msg.startThread({
            name: `${targetUser.username} [${targetUser.id}] への報告`,
          }),
        );
      }

      if (channel?.type === ChannelType.GuildForum) {
        createdThread = await channel.threads.create({
          name: `${targetUser.username} [${targetUser.id}] への報告`,
          message: reportMessageOptions,
        });
      }

      if (!createdThread) throw new Error('Invalid ChannelType');

      if (setting.enableMention) {
        createdThread.send({
          content: setting.mentionRoles.map(roleMention).join(),
        });
      }

      await db.insert(report).values({
        guildId: interaction.guildId,
        channelId: channel.id,
        threadId: createdThread.id,
        targetUserId: targetUser.id,
      });

      interaction.reply({
        content:
          '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました。',
        ephemeral: true,
      });
    } catch {
      interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });
    }
  },
);

export default [userContext, userReportModal];
