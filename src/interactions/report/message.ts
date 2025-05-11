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
  ContainerBuilder,
  Message,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
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
          ephemeral: true,
        });
      }
      return interaction.reply({
        content:
          '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }

    const message = interaction.targetMessage;
    const user = message.author;

    if (user.system || message.webhookId) {
      return interaction.reply({
        content: '`❌` システムメッセージやWebhookは報告できません。',
        ephemeral: true,
      });
    }

    if (user.equals(interaction.user)) {
      return interaction.reply({
        content: '`❌` 自分自身を報告しようとしています。',
        ephemeral: true,
      });
    }
    if (user.equals(interaction.client.user)) {
      return interaction.reply({
        content: `\`❌\` ${interaction.client.user.username}を報告することは出来ません。`,
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

    const message = await interaction.channel.messages
      .fetch(interaction.components[0].components[0].customId)
      .catch(() => null);
    const channel = await interaction.guild.channels
      .fetch(setting.channel)
      .catch(() => null);

    if (!(message instanceof Message)) {
      return interaction.reply({
        content:
          '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした。',
        ephemeral: true,
      });
    }
    if (!channel?.isTextBased()) {
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });
    }
    if (
      !channel
        ?.permissionsFor(interaction.client.user)
        ?.has([
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageThreads,
          PermissionFlagsBits.CreatePublicThreads,
        ])
    ) {
      return interaction.reply({
        content:
          '`❌` 送信先のチャンネルの権限が不足していたため、報告を送信できませんでした。サーバーの管理者に連絡してください。',
        ephemeral: true,
      });
    }

    const components = [];

    if (setting.enableMention) {
      components.push(
        new TextDisplayBuilder().setContent(
          setting.mentionRoles.map(roleMention).join(),
        ),
      );
    }

    components.push(
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
                  userField(message.author, { label: '送信者' }),
                  channelField(message.channel),
                  scheduleField(message.createdAt, { label: '送信時刻' }),
                ].join('\n'),
              ),
            ])
            .setThumbnailAccessory(
              new ThumbnailBuilder().setURL(message.author.displayAvatarURL()),
            ),
        ])
        .addActionRowComponents([
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setLabel('メッセージにアクセス')
              .setURL(message.url)
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
    );

    if (setting.showProgressButton) {
      components.push(
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
      );
    }

    // 報告の送信
    try {
      const createdThreadChannel = await channel
        .send({
          components,
          flags: MessageFlags.IsComponentsV2,
        })
        .then((msg) =>
          msg.startThread({
            name: `${message.author.username}への報告`,
          }),
        );

      createdThreadChannel.send({ forward: { message } });

      await db.insert(report).values({
        guildId: interaction.guildId,
        channelId: channel.id,
        threadId: createdThreadChannel.id,
        targetUserId: message.author.id,
        targetChannelId: message.channelId,
        targetMessageId: message.id,
      });

      interaction.reply({
        content:
          '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました',
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
