import { MessageContext, Modal } from '@akki256/discord-interaction';
import { gray } from '@const/emojis';
import { dashboard } from '@const/links';
import { ReportConfig } from '@models';
import { countField, scheduleField, userField } from '@modules/fields';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  Message,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  escapeSpoiler,
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

    const setting = await ReportConfig.findOne({
      guildId: interaction.guild.id,
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

    const setting = await ReportConfig.findOne({
      guildId: interaction.guild.id,
    });
    if (!setting?.channel) {
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
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
          '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした',
        ephemeral: true,
      });
    }
    if (!channel?.isTextBased()) {
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });
    }

    channel
      .send({
        content: setting.mention.enabled
          ? setting.mention.roles.map(roleMention).join()
          : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle('`📢` メッセージの報告')
            .setDescription(
              [
                userField(message.author, { label: '送信者' }),
                `${formatEmoji(gray.channel)} **メッセージ:** ${message.url}`,
                countField(message.attachments.size, {
                  emoji: 'link',
                  color: 'gray',
                  label: '送付ファイル',
                }),
                scheduleField(message.createdAt, { label: '送信時刻' }),
                '',
                userField(interaction.user, {
                  color: 'blurple',
                  label: '報告者',
                }),
              ].join('\n'),
            )
            .setColor(Colors.DarkButNotBlack)
            .setThumbnail(message.author.displayAvatarURL())
            .setFields(
              {
                name: 'メッセージ',
                value: escapeSpoiler(message.content || 'なし'),
              },
              {
                name: '理由',
                value: interaction.components[0].components[0].value,
              },
            ),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:report-consider')
              .setLabel('対処する')
              .setStyle(ButtonStyle.Primary),
          ),
        ],
      })
      .then((msg) => {
        interaction.reply({
          content:
            '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました',
          ephemeral: true,
        });
        msg
          .startThread({ name: `${message.author.username}への通報` })
          .catch(() => {});
      })
      .catch(() =>
        interaction.reply({
          content: '`❌` 報告の送信中にエラーが発生しました',
          ephemeral: true,
        }),
      );
  },
);

export default [messageContext, messageReportModal];
