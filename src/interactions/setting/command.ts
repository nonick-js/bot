import { ChatInput, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { ActionRowBuilder, ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder } from 'discord.js';
import { ControlPanelMessages, FeatureType } from './_messages';
import { ControlPanelComponentPagination } from './_pagination';

const command = new ChatInput(
  {
    name: 'setting',
    description: 'BOTの設定',
    options: [
      {
        name: '機能',
        description: '設定する機能',
        choices: [
          { name: '入退室メッセージ', value: FeatureType.JoinAndLeaveMessage },
          { name: 'サーバー内通報', value: FeatureType.ReportToAdmin },
          { name: 'メッセージURL展開', value: FeatureType.MessageExpansion },
          { name: 'イベントログ', value: FeatureType.EventLog },
          { name: '自動認証レベル変更', value: FeatureType.ChangeVerificationLevel },
          { name: '自動アナウンス公開', value: FeatureType.AutoPublic },
          { name: 'AutoMod Plus', value: FeatureType.AutoModPlus },
        ],
        type: ApplicationCommandOptionType.String,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  },
  { coolTime: 10_000 },
  async (interaction) => {
    if (interaction.options.getString('機能')) {
      const pagination = ControlPanelMessages.get(interaction.options.getString('機能') as FeatureType);
      if (!(pagination instanceof ControlPanelComponentPagination)) return;
      return pagination.replyMessage(interaction, true);
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🔧` 設定')
          .setDescription([
            '設定を変更したい機能を選択してください。',
            '操作方法や、各機能の詳しい設定の解説は[こちら](https://docs.nonick-js.com/nonick.js/setting/)か、それぞれの機能のドキュメントを参照してください。',
          ].join('\n'))
          .setColor(Colors.Blurple),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:setting-features')
            .setMinValues(0)
            .setOptions(
              { label: '入退室メッセージ', value: FeatureType.JoinAndLeaveMessage, description: 'メンバーの参加・脱退時にメッセージを送信', emoji: '🚪' },
              { label: 'サーバー内通報', value: FeatureType.ReportToAdmin, description: 'メンバーがメッセージやユーザーを通報できるように', emoji: '💬' },
              { label: 'メッセージURL展開', value: FeatureType.MessageExpansion, description: '送信されたDiscordのメッセージURLの内容を送信', emoji: '🔗' },
              { label: 'イベントログ', value: FeatureType.EventLog, description: 'サーバー内で起こったイベントのログを送信', emoji: '📃' },
              { label: '自動認証レベル変更', value: FeatureType.ChangeVerificationLevel, description: 'サーバーの認証レベルを自動で変更', emoji: '✅' },
              { label: '自動アナウンス公開', value: FeatureType.AutoPublic, description: 'アナウンスChに投稿されたメッセージを自動で公開', emoji: '📢' },
              { label: 'AutoMod Plus', value: FeatureType.AutoModPlus, description: '特定のフィルターに検知された送信をブロック', emoji: '🛡' },
            ),
        ),
      ],
      ephemeral: true,
    });
  },
);

const featuresSelect = new SelectMenu(
  { customId: 'nonick-js:setting-features', type: SelectMenuType.String },
  (interaction) => {
    if (!interaction.values.length) return interaction.update({});

    const pagination = ControlPanelMessages.get(interaction.values[0] as FeatureType);
    if (!(pagination instanceof ControlPanelComponentPagination)) return;
    pagination.replyMessage(interaction, true);
  },
);

module.exports = [command, featuresSelect];