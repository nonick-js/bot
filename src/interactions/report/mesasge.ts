import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, formatEmoji, Message, ModalBuilder, PermissionFlagsBits, roleMention, spoiler, TextChannel, TextInputBuilder, TextInputStyle, time } from 'discord.js';
import { MessageContext, Modal } from '@akki256/discord-interaction';
import ServerSettings from '../../schemas/ServerSettings';
import { BlurpleEmojies, GrayEmojies } from '../../module/emojies';

const reportContext = new MessageContext(
  {
    name: 'メッセージを報告',
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
    const message = interaction.targetMessage;
    const user = message.author;
    const member = await interaction.guild.members.fetch(user.id).catch(() => undefined);

    if (!Setting?.report?.channel)
      if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
        return interaction.reply({ content: '`❌` この機能を使用するには追加で設定が必要です。`/setting`で報告を受け取るチャンネルを設定してください。', ephemeral: true });
      else
        return interaction.reply({ content: '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。', ephemeral: true });


    if (user.system || message.webhookId)
      return interaction.reply({ content: '`❌` システムメッセージやWebhookは報告できません。', ephemeral: true });
    if (user.id === interaction.user.id)
      return interaction.reply({ content: '`❌` 自分自身を報告しようとしています。', ephemeral: true });
    if (user.id === interaction.client.user.id)
      return interaction.reply({ content: `\`❌\` ${interaction.client.user.username}を報告することは出来ません。`, ephemeral: true });
    if (member && member?.permissions?.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({ content: '`❌` サーバー運営のメッセージを報告することはできません。', ephemeral: true });

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

    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
    if (!Setting?.report?.channel) return interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });

    const message = await interaction.channel.messages.fetch(interaction.components[0].components[0].customId).catch(() => undefined);
    const channel = await interaction.guild.channels.fetch(Setting.report.channel).catch(() => undefined);

    if (!(message instanceof Message))
      return interaction.reply({ content: '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした', ephemeral: true });
    if (!(channel instanceof TextChannel)) {
      interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });
      Setting.report.channel = null;
      return Setting.save({ wtimeout: 1_500 });
    }

    channel
      .send({
        content: Setting.report.mention?.enable ? roleMention(Setting.report.mention.role || '0') : undefined,
        embeds: [
          new EmbedBuilder()
            .setTitle('`📢` メッセージの報告')
            .setDescription([
              `${formatEmoji(GrayEmojies.edit)} **送信者:** ${message.author} [${message.author.tag}]`,
              `${formatEmoji(GrayEmojies.channel)} **チャンネル:** ${message.channel} [${message.channel.name}]`,
              `${formatEmoji(GrayEmojies.link)} **添付ファイル:** ${message.attachments.size}件`,
              `${formatEmoji(GrayEmojies.schedule)} **送信時刻:** ${time(Math.floor(message.createdTimestamp / 1000), 'f')}`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **報告者:** ${interaction.user} [${interaction.user.tag}]`,
            ].join('\n'))
            .setColor(Colors.DarkButNotBlack)
            .setThumbnail(message.author.displayAvatarURL())
            .setFields(
              { name: 'メッセージ', value: spoiler(message.content) },
              { name: '理由', value: interaction.components[0].components[0].value },
            ),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:report-completed')
              .setLabel('対処済み')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('nonick-js:report-ignore')
              .setLabel('無視')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setLabel('メッセージ')
              .setURL(message.url)
              .setStyle(ButtonStyle.Link),
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