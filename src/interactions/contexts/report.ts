import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, formatEmoji, Message, ModalBuilder, PermissionFlagsBits, roleMention, spoiler, TextChannel, TextInputBuilder, TextInputStyle, time } from 'discord.js';
import { MessageContext, Modal, Button } from '@akki256/discord-interaction';
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
    const member = await interaction.guild.members.fetch(user.id).catch(() => {});

    if (!Setting?.report?.channel) {
      if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        interaction.reply({ content: '`❌` この機能を使用するには追加で設定が必要です。`/setting`で報告を受け取るチャンネルを設定してください。', ephemeral: true });
        return;
      }
      else {
        interaction.reply({ content: '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。', ephemeral: true });
        return;
      }
    }

    if (user.system || message.webhookId) {
      interaction.reply({ content: '`❌` システムメッセージやWebhookは報告できません。', ephemeral: true });
      return;
    }
    else if (user.id == interaction.user.id) {
      interaction.reply({ content: '`❌` 自分自身を報告しようとしています。', ephemeral: true });
      return;
    }
    else if (user.id == interaction.client.user.id) {
      interaction.reply({ content: `\`❌\` ${interaction.client.user.username}を報告することは出来ません。`, ephemeral: true });
      return;
    }
    else if (member?.permissions?.has(PermissionFlagsBits.ManageMessages)) {
      interaction.reply({ content: '`❌` サーバー運営のメッセージを報告することはできません。', ephemeral: true });
      return;
    }

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:reportModal')
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
  { customId: 'nonick-js:reportModal' },
  async (interaction): Promise<void> => {
    if (!interaction.inCachedGuild()) return;
    if (!interaction.channel || interaction.components[0].components[0].type !== ComponentType.TextInput) return;

    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

    if (!Setting?.report?.channel) {
      interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });
      return;
    }

    const message = await interaction.channel.messages.fetch(interaction.components[0].components[0].customId).catch(() => {});
    const channel = await interaction.guild.channels.fetch(Setting.report.channel).catch(() => {});

    if (!(message instanceof Message)) {
      interaction.reply({ content: '`❌` 報告しようとしているメッセージは削除されたか、BOTがアクセスできませんでした', ephemeral: true });
      return;
    }
    if (!(channel instanceof TextChannel)) {
      await Setting.updateOne({ $set: { 'report.channel': null } });
      await Setting.save({ wtimeout: 1_500 });
      interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });
      return;
    }

    channel
      .send({
        content: Setting.report.mention?.enable ? roleMention(Setting.report.mention.role) : undefined,
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
      .then(() => interaction.reply({ content: '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました', ephemeral: true }))
      .catch(() => interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true }));
  },
);

const actionButton = new Button(
  { customId: /^nonick-js:report-(completed|ignore)$/ },
  (interaction): void => {
    const customId = interaction.customId.replace('nonick-js:report-', '');

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:report-actionModal')
        .setTitle(`${customId == 'completed' ? '対処済み' : '対処無し'}としてマーク`)
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(customId == 'completed' ? 'action' : 'reason')
              .setLabel('行った対処・処罰')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );
  },
);

const actionModal = new Modal(
  { customId: 'nonick-js:report-actionModal' },
  (interaction): void => {
    if (!interaction.isFromMessage() || interaction.components[0].components[0].type !== ComponentType.TextInput) return;

    const embed = interaction.message.embeds[0];
    const category = interaction.components[0].components[0].customId;
    const categoryValue = interaction.components[0].components[0].value;

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle(`${embed.title} ` + (category == 'action' ? '[対応済み]' : '[対応なし]'))
          .setDescription([
            `${embed.description}`,
            `${formatEmoji(BlurpleEmojies.member)} **モデレーター:** ${interaction.user} [${interaction.user.tag}]`,
            `${formatEmoji(BlurpleEmojies.admin)} **${category == 'action' ? '行った処罰' : '対応なしの理由'}:** ${categoryValue}`,
          ].join('\n'))
          .setColor(category == 'action' ? Colors.Green : Colors.Red),
      ],
      components: [],
    });
  },
);

module.exports = [reportContext, reportContextModal, actionButton, actionModal];