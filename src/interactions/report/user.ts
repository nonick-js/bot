import { Modal, UserContext } from '@akki256/discord-interaction';
import { dashboard } from '@const/links';
import { db } from '@modules/drizzle';
import { scheduleField, userField } from '@modules/fields';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  hyperlink,
  roleMention,
} from 'discord.js';

const userContext = new UserContext(
  {
    name: 'ユーザーを報告',
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

    const user = interaction.targetUser;

    if (user.system || user.equals(interaction.client.user)) {
      return interaction.reply({
        content: '`❌` このユーザーを通報することはできません。',
        ephemeral: true,
      });
    }

    if (user.equals(interaction.user)) {
      return interaction.reply({
        content: '`❌` 自分自身を報告しようとしています。',
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
    if (!setting?.channel) {
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });
    }

    const target = await interaction.client.users
      .fetch(interaction.components[0].components[0].customId)
      .catch(() => null);
    const channel = await interaction.guild.channels
      .fetch(setting.channel)
      .catch(() => null);

    if (!(target && channel?.isTextBased()))
      return interaction.reply({
        content: '`❌` 報告の送信中にエラーが発生しました',
        ephemeral: true,
      });

    channel
      .send({
        content: setting.enableMention
          ? setting.mentionRoles.map(roleMention).join()
          : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle('`📢` ユーザーの通報')
            .setDescription(
              [
                userField(target, {
                  emoji: 'edit',
                  color: 'gray',
                  label: '対象者',
                }),
                scheduleField(target.createdAt, {
                  label: 'アカウント作成日',
                }),
                '',
                userField(interaction.user, {
                  color: 'blurple',
                  label: '報告者',
                }),
              ].join('\n'),
            )
            .setColor(Colors.DarkButNotBlack)
            .setThumbnail(target.displayAvatarURL())
            .setFields({
              name: '理由',
              value: interaction.components[0].components[0].value,
            }),
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
      .then((message) => {
        interaction.reply({
          content:
            '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました',
          ephemeral: true,
        });
        message
          .startThread({ name: `${target.username}への通報` })
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

export default [userContext, userReportModal];
