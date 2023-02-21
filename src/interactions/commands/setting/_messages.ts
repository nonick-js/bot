import { ActionRowBuilder, ButtonBuilder, ButtonStyle, channelMention, ChannelType, Colors, EmbedBuilder, formatEmoji, StringSelectMenuBuilder } from 'discord.js';
import { GrayEmojies, WhiteEmojies } from '../../../module/emojies';
import { ControlPanelComponentPagination } from './_pagination';
import { booleanStatus, buttonLabelStatus, buttonStyleStatus, channelStatus, roleStatus } from '../../../module/settingStatus';

export const ControlPanelMessages = new Map<FeatureType, ControlPanelComponentPagination>();

export enum FeatureType {
  JoinAndLeaveMessage = 'joinAndLeaveMessage',
  ReportToAdmin = 'reportToAdmin',
  MessageExpansion = 'messageExpansion',
  EventLog = 'eventLog',
  ChangeVerificationLevel = 'changeVerificationLevel',
}

const ChannelTypeMap = new Map([
  [ ChannelType.GuildAnnouncement, 'Announcement' ],
  [ ChannelType.PublicThread, 'Thread(公開)' ],
  [ ChannelType.PrivateThread, 'Thread(プライベート)' ],
  [ ChannelType.GuildVoice, 'Voice' ],
  [ ChannelType.GuildStageVoice, 'Stage' ],
]);

const verificationLevel = [
  '`❌` これが見えるのはおかしいよ',
  '`🟢` **低:** メール認証がされているアカウントのみ',
  '`🟡` **中:** Discordに登録してから5分以上経過したアカウントのみ',
  '`🟠` **高:** このサーバーのメンバーとなってから10分以上経過したメンバーのみ',
  '`🔴` **最高:** 電話認証がされているアカウントのみ',
];

// 入退室メッセージ
ControlPanelMessages.set(FeatureType.JoinAndLeaveMessage, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({ embeds: [
    new EmbedBuilder()
    .setTitle('`🔧` 設定-入退室メッセージ')
    .setDescription('```メンバーがサーバーに参加したり脱退したりした際にメッセージを送信します。(メッセージは各設定の「プレビュー」ボタンで確認できます。)```')
    .setColor(Colors.Blurple)
    .setFields(
      {
        name: '入室時',
        value: `${booleanStatus(setting?.message.join.enable)}\n${channelStatus(setting?.message.join.channel)}`,
        inline: true,
      },
      {
        name: '退室時',
        value: `${booleanStatus(setting?.message.leave.enable)}\n${channelStatus(setting?.message.leave.channel)}`,
        inline: true,
      },
    ),
  ] }))
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-join-enable')
        .setLabel(buttonLabelStatus(setting?.message.join.enable))
        .setStyle(buttonStyleStatus(setting?.message.join.enable))
        .setDisabled(!setting?.message.join.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-join-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-join-message')
        .setLabel('メッセージ')
        .setEmoji(WhiteEmojies.message)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-join-preview')
        .setLabel('プレビュー')
        .setStyle(ButtonStyle.Primary),
    ),
  ], { name: '入室メッセージ', description: 'メンバー参加時にメッセージを送信', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-leave-enable')
        .setLabel(buttonLabelStatus(setting?.message.leave.enable))
        .setStyle(buttonStyleStatus(setting?.message.leave.enable))
        .setDisabled(!setting?.message.leave.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-leave-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-leave-message')
        .setLabel('メッセージ')
        .setEmoji(WhiteEmojies.message)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-leave-preview')
        .setLabel('プレビュー')
        .setStyle(ButtonStyle.Primary),
    ),
  ], { name: '退室メッセージ', description: 'メンバー退室時にメッセージを送信', emoji: WhiteEmojies.setting }),
);

// サーバー内通報
ControlPanelMessages.set(FeatureType.ReportToAdmin, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({ embeds: [
    new EmbedBuilder()
      .setTitle('`🔧` 設定-サーバー内通報')
      .setDescription('```メンバーがルールに違反したメッセージやユーザーをモデレーターに通報できるようになります。```')
      .setColor(Colors.Blurple)
      .setFields(
        {
          name: '一般設定',
          value: channelStatus(setting?.report.channel),
          inline: true,
        },
        {
          name: '通知設定',
          value: `${booleanStatus(setting?.report.mention.enable)}\n${roleStatus(setting?.report.mention.role)}`,
          inline: true,
        },
      ),
  ] }))
  .addActionRows(() => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-report-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: '基本設定', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-report-mention-enable')
        .setLabel(buttonLabelStatus(setting?.report.mention.enable))
        .setStyle(buttonStyleStatus(setting?.report.mention.enable))
        .setDisabled(!setting?.report.mention.role),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-report-mention-role')
        .setLabel('ロール')
        .setEmoji(WhiteEmojies.role)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: '通知設定', description: '通報受信時にロールをメンション', emoji: WhiteEmojies.role }),
);

// メッセージURL展開
ControlPanelMessages.set(FeatureType.MessageExpansion, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({ embeds: [
    new EmbedBuilder()
      .setTitle('`🔧` 設定-メッセージURL展開')
      .setDescription('```DiscordのメッセージURLが送信された際に、そのメッセージの内容や送信者の情報を送信します。```')
      .setColor(Colors.Blurple)
      .setFields(
        {
          name: '基本設定',
          value: booleanStatus(setting?.message.expansion.enable),
        },
        {
          name: '例外 (タイプ)',
          value: setting?.message.expansion.ignore.types?.map(v => ChannelTypeMap.get(v)).filter(Boolean).map(v => `\`${v}\``).join(' ') || 'なし',
          inline: true,
        },
        {
          name: '例外 (チャンネル)',
          value: setting?.message.expansion.ignore.ids?.map(v => channelMention(v)).join(' ') || 'なし',
          inline: true,
        },
      ),
  ] }))
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-expansion-enable')
        .setLabel(buttonLabelStatus(setting?.message.expansion.enable))
        .setStyle(buttonStyleStatus(setting?.message.expansion.enable)),
    ),
  ], { name: '基本設定', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('nonick-js:setting-message-expansion-ignore-types')
        .setMinValues(0)
        .setMaxValues(5)
        .setPlaceholder('例外設定 (タイプ)')
        .setOptions(
          {
            label: 'アナウンス',
            value: String(ChannelType.GuildAnnouncement),
            emoji: '966773928787836958',
            default: setting?.message.expansion.ignore.types?.includes(ChannelType.GuildAnnouncement),
          },
          {
            label: 'ボイス',
            value: String(ChannelType.GuildVoice),
            emoji: '966773928733315142',
            default: setting?.message.expansion.ignore.types?.includes(ChannelType.GuildVoice),
          },
          // {
          //   label: 'ステージ',
          //   value: String(ChannelType.GuildStageVoice),
          //   emoji: '966773928645255178',
          //   default: setting?.message.expansion.ignore.types?.includes(ChannelType.GuildStageVoice),
          // },
          {
            label: 'スレッド(公開)',
            value: String(ChannelType.PublicThread),
            emoji: '966773928712359946',
            default: setting?.message.expansion.ignore.types?.includes(ChannelType.PublicThread),
          },
          {
            label: 'スレッド(プライベート)',
            value: String(ChannelType.PrivateThread),
            emoji: '966773928712359946',
            default: setting?.message.expansion.ignore.types?.includes(ChannelType.PrivateThread),
          },
        ),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-expansion-ignore-addChannel')
        .setEmoji(WhiteEmojies.addMark)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-message-expansion-ignore-deleteAll')
        .setLabel('例外チャンネルを全削除')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(!setting?.message.expansion.ignore.ids.length),
    ),
  ], { name: '例外設定', description: 'URL展開を行わないチャンネルを設定', emoji: WhiteEmojies.setting }),
);

// イベントログ
ControlPanelMessages.set(FeatureType.EventLog, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({ embeds: [
    new EmbedBuilder()
      .setTitle('`🔧`設定-イベントログ')
      .setDescription('```サーバー内で起こったイベントのログを送信します。```')
      .setColor(Colors.Blurple)
      .setFields(
        {
          name: 'Timeout',
          value: `${booleanStatus(setting?.log.timeout.enable)}\n${channelStatus(setting?.log.timeout.channel)}`,
          inline: true,
        },
        {
          name: 'Kick',
          value: `${booleanStatus(setting?.log.kick.enable)}\n${channelStatus(setting?.log.kick.channel)}`,
          inline: true,
        },
        {
          name: 'BAN',
          value: `${booleanStatus(setting?.log.ban.enable)}\n${channelStatus(setting?.log.ban.channel)}`,
          inline: true,
        },
      ),
  ] }))
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-timeout-enable')
        .setLabel(buttonLabelStatus(setting?.log.timeout.enable))
        .setStyle(buttonStyleStatus(setting?.log.timeout.enable))
        .setDisabled(!setting?.log?.timeout?.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-timeout-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'Timeoutログ', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-kick-enable')
        .setLabel(buttonLabelStatus(setting?.log.kick.enable))
        .setStyle(buttonStyleStatus(setting?.log.kick.enable))
        .setDisabled(!setting?.log.kick.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-kick-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'Kickログ', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-ban-enable')
        .setLabel(buttonLabelStatus(setting?.log.ban.enable))
        .setStyle(buttonStyleStatus(setting?.log.ban.enable))
        .setDisabled(!setting?.log.ban.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-ban-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'BANログ', emoji: WhiteEmojies.setting }),
);

// 自動認証レベル変更
ControlPanelMessages.set(FeatureType.ChangeVerificationLevel, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({ embeds: [
    new EmbedBuilder()
      .setTitle('`🔧` 設定-自動認証レベル変更')
      .setDescription('```決まった時間の間、サーバーの認証レベルを自動で変更します。```')
      .setColor(Colors.Blurple)
      .setFields(
        {
          name: '一般設定',
          value: [
            booleanStatus(setting?.changeVerificationLevel.enable),
            `${formatEmoji(GrayEmojies.schedule)} **開始時刻: **${setting?.changeVerificationLevel.time.start == null ? '未設定' : `${setting?.changeVerificationLevel.time.start}:00`}`,
            `${formatEmoji(GrayEmojies.schedule)} **終了時刻: **${setting?.changeVerificationLevel.time.end == null ? '未設定' : `${setting?.changeVerificationLevel.time.end}:00`}`,
          ].join('\n'),
          inline: true,
        },
        {
          name: 'ログ',
          value: `${booleanStatus(setting?.changeVerificationLevel.log.enable)}\n${channelStatus(setting?.changeVerificationLevel.log.channel)}`,
          inline: true,
        },
        {
          name: '期間中に変更するレベル',
          value: `${setting?.changeVerificationLevel.level.new == null ? '未設定' : verificationLevel[setting?.changeVerificationLevel.level.new]}`,
        },
      ),
  ] }))
  .addActionRows((setting) => [
    new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('nonick-js:setting-changeVerificationLevel-level')
        .setPlaceholder('期間中に変更する認証レベルを設定')
        .setOptions([
          { label: '低', value: '1', description: 'メール認証がされているアカウントのみ', emoji: '🟢' },
          { label: '中', value: '2', description: 'Discordに登録してから5分以上経過したアカウントのみ', emoji: '🟡' },
          { label: '高', value: '3', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ', emoji: '🟠' },
          { label: '最高', value: '4', description: '電話認証がされているアカウントのみ', emoji: '🔴' },
        ].map(option => ({ ...option, default: setting?.changeVerificationLevel.level.new == Number(option.value) }))),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-changeVerificationLevel-enable')
        .setLabel(buttonLabelStatus(setting?.changeVerificationLevel.enable))
        .setStyle(buttonStyleStatus(setting?.changeVerificationLevel.enable))
        .setDisabled(!(setting?.changeVerificationLevel.level.new && setting?.changeVerificationLevel.time.start !== null && setting?.changeVerificationLevel.time.end !== null)),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-changeVerificationLevel-time')
        .setLabel('開始・終了時間')
        .setEmoji(WhiteEmojies.schedule)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: '一般設定', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-changeVerificationLevel-log-enable')
        .setLabel(buttonLabelStatus(setting?.changeVerificationLevel.log.enable))
        .setStyle(buttonStyleStatus(setting?.changeVerificationLevel.log.enable))
        .setDisabled(!setting?.changeVerificationLevel.log.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-changeVerificationLevel-log-channel')
        .setLabel('送信先')
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'ログ設定', description: '認証レベルを変更した際にログを送信する', emoji: WhiteEmojies.setting }),
);