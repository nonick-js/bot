import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, escapeSpoiler, formatEmoji, Message, ModalBuilder, PermissionFlagsBits, roleMention, TextInputBuilder, TextInputStyle, time } from 'discord.js';
import { MessageContext, Modal } from '@akki256/discord-interaction';
import { Emojis } from '../../module/constant';
import { getServerSetting } from '../../module/mongo/middleware';

const reportContext = new MessageContext(
  {
    name: 'メッセージを報告',
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await getServerSetting(interaction.guildId, 'report');

    if (!setting?.channel)
      if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
        return interaction.reply({ content: '`❌` この機能を使用するには追加で設定が必要です。`/setting`で報告を受け取るチャンネルを設定してください。', ephemeral: true });
      else
        return interaction.reply({ content: '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。', ephemeral: true });

    const message = interaction.targetMessage;
    const user = message.author;

    if (user.system || message.webhookId)
      return interaction.reply({ content: '`❌` システムメッセージやWebhookは報告できません。', ephemeral: true });
    if (user.id === interaction.user.id)
      return interaction.reply({ content: '`❌` 自分自身を報告しようとしています。', ephemeral: true });
    if (user.id === interaction.client.user.id)
      return interaction.reply({ content: `\`❌\` ${interaction.client.user.username}を報告することは出来ません。`, ephemeral: true });

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:messageReportModal')
        .setTitle('メッセージを報告')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId(interaction.targetId)
              .setLabel('詳細')
              .setPlaceholder('送信した報告はサーバーの運営のみ公開され、DiscordのTrust&Safetyには報告されません。')
              .setMaxLength(1500)
              .setStyle(TextInputStyle.Paragraph),
          ),
        ),
    );
  },
);

const reportContextModal = new Modal(
  { customId: 'nonick-js:messageReportModal' },
  async (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel || interaction.components[0].components[0].type !== ComponentType.TextInput) return;
    const setting = await getServerSetting(interaction.guildId, 'report');
    if (!setting?.channel) return interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });

    const message = await interaction.channel.messages.fetch(interaction.components[0].components[0].customId).catch(() => undefined);
    const channel = await interaction.guild.channels.fetch(setting.channel).catch(() => undefined);

    if (!(message instanceof Message))
      return interaction.reply({ content: '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした', ephemeral: true });
    if (!channel?.isTextBased())
      return interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });

    channel
      .send({
        content: setting.mention.enable ? roleMention(setting.mention.role || '0') : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle('`📢` メッセージの報告')
            .setDescription([
              `${formatEmoji(Emojis.Gray.edit)} **送信者:** ${message.author} [${message.author.tag}]`,
              `${formatEmoji(Emojis.Gray.channel)} **メッセージ:** ${message.url}`,
              `${formatEmoji(Emojis.Gray.link)} **添付ファイル:** ${message.attachments.size}件`,
              `${formatEmoji(Emojis.Gray.schedule)} **送信時刻:** ${time(Math.floor(message.createdTimestamp / 1000), 'f')}`,
              '',
              `${formatEmoji(Emojis.Blurple.member)} **報告者:** ${interaction.user} [${interaction.user.tag}]`,
            ].join('\n'))
            .setColor(Colors.DarkButNotBlack)
            .setThumbnail(message.author.displayAvatarURL())
            .setFields(
              { name: 'メッセージ', value: escapeSpoiler(message.content || 'なし') },
              { name: '理由', value: interaction.components[0].components[0].value },
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
      .then(msg => {
        interaction.reply({ content: '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました', ephemeral: true });
        msg.startThread({ name: `${message.author.username}への通報` }).catch(() => { });
      })
      .catch(() => interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true }));
  },
);

module.exports = [reportContext, reportContextModal];