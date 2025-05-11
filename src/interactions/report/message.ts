import { MessageContext, Modal } from '@akki256/discord-interaction';
import { blurple, red } from '@const/emojis';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import { channelField, scheduleField, userField } from '@modules/fields';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  Message,
  MessageFlags,
  ModalBuilder,
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
import { isReportable, isSendableReport } from './_function';

const messageContext = new MessageContext(
  {
    name: 'メッセージを通報',
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
    const components = [];

    if (!channel?.isTextBased()) return;
    if (!(targetMessage instanceof Message)) {
      return interaction.reply({
        content:
          '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした。',
        ephemeral: true,
      });
    }

    const { ok, reason } = await isSendableReport(interaction, channel);
    if (!ok)
      return interaction.reply({
        content: reason,
        ephemeral: true,
      });

    // 報告の送信
    try {
      const createdThread = await channel
        .send({
          components: [
            new ContainerBuilder()
              .addTextDisplayComponents([
                new TextDisplayBuilder().setContent(
                  `## ${formatEmoji(red.flag)} メッセージの報告`,
                ),
              ])
              .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
              )
              .addSectionComponents([
                new SectionBuilder()
                  .addTextDisplayComponents([
                    new TextDisplayBuilder().setContent('### メッセージの情報'),
                    new TextDisplayBuilder().setContent(
                      [
                        userField(targetMessage.author, { label: '送信者' }),
                        channelField(targetMessage.channel),
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
              .addActionRowComponents([
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                  new ButtonBuilder()
                    .setLabel('メッセージにアクセス')
                    .setURL(targetMessage.url)
                    .setStyle(ButtonStyle.Link),
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
            ),
          ],
          flags: MessageFlags.IsComponentsV2,
          allowedMentions: {
            users: [],
            roles: setting.mentionRoles,
          },
        })
        .then((msg) =>
          msg.startThread({
            name: `${targetMessage.author.username} [${targetMessage.author.id}] への報告`,
          }),
        );

      if (setting.enableMention) {
        createdThread.send({
          forward: { message: targetMessage },
          components: [
            new TextDisplayBuilder().setContent(
              setting.mentionRoles.map(roleMention).join(),
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

export default [messageContext, messageReportModal];
