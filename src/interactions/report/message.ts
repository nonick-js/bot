import { MessageContext, Modal } from '@akki256/discord-interaction';
import { blurple, red } from '@const/emojis';
import { dashboard } from '@const/links';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import { channelField, scheduleField, userField } from '@modules/fields';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ContainerBuilder,
  type ForumThreadChannel,
  Message,
  type MessageCreateOptions,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  type PublicThreadChannel,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
  ThumbnailBuilder,
  escapeMarkdown,
  hyperlink,
  roleMention,
} from 'discord.js';

const messageContext = new MessageContext(
  {
    name: 'メッセージを通報',
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.reportSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting?.channel) {
      if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        return interaction.reply({
          content: `\`❌\` この機能を使用するには、ダッシュボードで${hyperlink('報告を受け取るチャンネルを設定', `<${dashboard}/guilds/${interaction.guild.id}/report>`)}する必要があります。`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return interaction.reply({
        content:
          '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
        flags: MessageFlags.Ephemeral,
      });
    }

    const targetMember = interaction.targetMessage.member;
    const targetUser = interaction.targetMessage.author;

    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        content: '`❌` 自分自身を報告しようとしています。',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (
      targetUser.system ||
      targetUser.bot ||
      targetUser.id === interaction.client.user.id
    ) {
      return interaction.reply({
        content: '`❌` このユーザーを通報することはできません。',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (
      !setting.includeModerator &&
      targetMember?.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      return interaction.reply({
        content: '`❌` モデレーターを通報することはできません。',
        flags: MessageFlags.Ephemeral,
      });
    }
    if (interaction.targetMessage.webhookId) {
      return interaction.reply({
        content: '`❌` Webhookを報告することはできません。',
        flags: MessageFlags.Ephemeral,
      });
    }

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:messageReportModal')
        .setTitle('メッセージを報告')
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

const messageReportModal = new Modal(
  {
    customId: 'nonick-js:messageReportModal',
  },
  async (interaction) => {
    if (!(interaction.inCachedGuild() && interaction.channel)) return;

    const setting = await db.query.reportSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting?.channel) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルが存在しないため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }

    const targetMessage = await interaction.channel.messages
      .fetch(interaction.components[0].components[0].customId)
      .catch(() => null);
    const channel = await interaction.guild.channels
      .fetch(setting.channel)
      .catch(() => null);
    const permission = channel?.permissionsFor(interaction.client.user);

    if (!(targetMessage instanceof Message)) {
      return interaction.reply({
        content:
          '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした。',
        ephemeral: true,
      });
    }
    if (!channel) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルが存在しないため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }
    if (
      !(
        permission?.has(PermissionFlagsBits.SendMessages) &&
        permission.has(PermissionFlagsBits.SendMessagesInThreads) &&
        permission.has(PermissionFlagsBits.ManageThreads) &&
        permission.has(PermissionFlagsBits.CreatePublicThreads)
      )
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
              `## ${formatEmoji(red.flag)} メッセージの報告`,
            ),
          ])
          .addSeparatorComponents(
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(false),
          )
          .addSectionComponents([
            new SectionBuilder()
              .addTextDisplayComponents([
                new TextDisplayBuilder().setContent('### メッセージの情報'),
                new TextDisplayBuilder().setContent(
                  [
                    userField(targetMessage.author, { label: '送信者' }),
                    channelField(targetMessage.channel, { label: '送信先' }),
                    scheduleField(targetMessage.createdAt, {
                      label: '送信時刻',
                    }),
                  ].join('\n'),
                ),
              ])
              .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(
                  targetMessage.author.displayAvatarURL(),
                ),
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
        new ContainerBuilder().addActionRowComponents([
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:report-completed')
              .setLabel('対応済みにする')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('nonick-js:report-ignore')
              .setLabel('無視')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setLabel('メッセージを確認')
              .setURL(targetMessage.url)
              .setStyle(ButtonStyle.Link),
          ),
        ]),
      ],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: {
        parse: ['roles'],
      },
    };

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      let createdThread: PublicThreadChannel | ForumThreadChannel | null = null;

      if (channel?.type === ChannelType.GuildText) {
        createdThread = await channel.send(reportMessageOptions).then((msg) =>
          msg.startThread({
            name: `${targetMessage.author.username} [${targetMessage.author.id}] への報告`,
          }),
        );
      }

      if (channel?.type === ChannelType.GuildForum) {
        createdThread = await channel.threads.create({
          name: `${targetMessage.author.username} [${targetMessage.author.id}] への報告`,
          message: reportMessageOptions,
        });
      }

      if (!createdThread) throw new Error('Invalid ChannelType');

      if (setting.enableMention) {
        createdThread.send({
          forward: { message: targetMessage },
          components: [
            new TextDisplayBuilder().setContent(
              `🔔${setting.mentionRoles.map(roleMention).join()}`,
            ),
          ],
          flags: MessageFlags.IsComponentsV2,
        });
      } else {
        createdThread.send({
          forward: { message: targetMessage },
        });
      }

      await db.insert(report).values({
        guildId: interaction.guildId,
        channelId: channel.id,
        threadId: createdThread.id,
        targetUserId: targetMessage.author.id,
        targetChannelId: targetMessage.channelId,
        targetMessageId: targetMessage.id,
      });

      interaction.followUp({
        content:
          '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました。',
        flags: MessageFlags.Ephemeral,
      });
    } catch {
      interaction.followUp({
        content: '`❌` 報告の送信中にエラーが発生しました',
        flags: MessageFlags.Ephemeral,
      });
    }
  },
);

export default [messageContext, messageReportModal];
