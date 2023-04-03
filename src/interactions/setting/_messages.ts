import { ActionRowBuilder, ButtonBuilder, ButtonStyle, channelMention, ChannelSelectMenuBuilder, ChannelType, Colors, EmbedBuilder, formatEmoji, inlineCode, roleMention, RoleSelectMenuBuilder, StringSelectMenuBuilder } from 'discord.js';
import { GrayEmojies, WhiteEmojies } from '../../module/emojies';
import { ControlPanelComponentPagination } from './_pagination';
import { booleanStatus, buttonLabelStatus, buttonStyleStatus, channelStatus, roleStatus } from '../../module/settingStatus';

export const ControlPanelMessages = new Map<FeatureType, ControlPanelComponentPagination>();

export enum FeatureType {
  JoinAndLeaveMessage = 'joinAndLeaveMessage',
  ReportToAdmin = 'reportToAdmin',
  MessageExpansion = 'messageExpansion',
  EventLog = 'eventLog',
  ChangeVerificationLevel = 'changeVerificationLevel',
  AutoPublic = 'autoPublic',
  AutoModPlus = 'autoModPlus',
  AutoCreateThread = 'autoCreateThread',
}

const ChannelTypeMap = new Map([
  [ChannelType.GuildAnnouncement, 'Announcement'],
  [ChannelType.PublicThread, 'Thread(公開)'],
  [ChannelType.PrivateThread, 'Thread(プライベート)'],
  [ChannelType.GuildVoice, 'Voice'],
  [ChannelType.GuildStageVoice, 'Stage'],
]);

const verificationLevel = [
  '`❌` これが見えるのはおかしいよ',
  '`🟢` **低:** メール認証がされているアカウントのみ',
  '`🟡` **中:** Discordに登録してから5分以上経過したアカウントのみ',
  '`🟠` **高:** このサーバーのメンバーとなってから10分以上経過したメンバーのみ',
  '`🔴` **最高:** 電話認証がされているアカウントのみ',
];

const autoModFilter = new Map([
  ['inviteUrl', '招待URL'],
  ['token', 'Discordトークン'],
  ['shortUrl', '短縮URL'],
]);

// 入退室メッセージ
ControlPanelMessages.set(FeatureType.JoinAndLeaveMessage, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: 入退室メッセージ')
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
    ],
  }))
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
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: サーバー内通報')
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
    ],
  }))
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
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: メッセージURL展開')
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
            value: setting?.message.expansion.ignore.channels?.map(v => channelMention(v)).join(' ') || 'なし',
            inline: true,
          },
        ),
    ],
  }))
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
        .setMaxValues(4)
        .setPlaceholder('例外設定 (タイプ)')
        .setOptions(
          [
            {
              label: 'アナウンス',
              value: String(ChannelType.GuildAnnouncement),
              emoji: '966773928787836958',
            },
            {
              label: 'ボイス',
              value: String(ChannelType.GuildVoice),
              emoji: '966773928733315142',
            },
            // {
            //   label: 'ステージ',
            //   value: String(ChannelType.GuildStageVoice),
            //   emoji: '966773928645255178',
            // },
            {
              label: 'スレッド(公開)',
              value: String(ChannelType.PublicThread),
              emoji: '966773928712359946',
            },
            {
              label: 'スレッド(プライベート)',
              value: String(ChannelType.PrivateThread),
              emoji: '966773928712359946',
            },
          ].map(options => ({ ...options, default: setting?.message.expansion.ignore.types.includes(Number(options.value)) })),
        ),
    ),
    new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('nonick-js:setting-message-expansion-ignore-channels')
        .setPlaceholder('例外設定 (チャンネル)')
        .setChannelTypes([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildVoice, ChannelType.GuildStageVoice])
        .setMinValues(0)
        .setMaxValues(25),
    ),
  ], { name: '例外設定', description: 'URL展開を行わないチャンネルを設定', emoji: WhiteEmojies.setting }),
);

// イベントログ
ControlPanelMessages.set(FeatureType.EventLog, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧`設定: イベントログ')
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
          {
            name: 'VC',
            value: `${booleanStatus(setting?.log.voice.enable)}\n${channelStatus(setting?.log.voice.channel)}`,
            inline: true,
          },
          {
            name: '削除',
            value: `${booleanStatus(setting?.log.delete.enable)}\n${channelStatus(setting?.log.delete.channel)}`,
            inline: true,
          },
        ),
    ],
  }))
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
  ], { name: 'BANログ', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-voice-enable')
        .setLabel(buttonLabelStatus(setting?.log.voice.enable))
        .setStyle(buttonStyleStatus(setting?.log.voice.enable))
        .setDisabled(!setting?.log.voice.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-voice-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'VCログ', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-delete-enable')
        .setLabel(buttonLabelStatus(setting?.log.delete.enable))
        .setStyle(buttonStyleStatus(setting?.log.delete.enable))
        .setDisabled(!setting?.log.delete.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-log-delete-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: '削除ログ', emoji: WhiteEmojies.setting }),
);

// 自動認証レベル変更
ControlPanelMessages.set(FeatureType.ChangeVerificationLevel, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: 自動認証レベル変更')
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
            name: 'ログ設定',
            value: `${booleanStatus(setting?.changeVerificationLevel.log.enable)}\n${channelStatus(setting?.changeVerificationLevel.log.channel)}`,
            inline: true,
          },
          {
            name: '期間中に変更するレベル',
            value: `${setting?.changeVerificationLevel.level.new == null ? '未設定' : verificationLevel[setting?.changeVerificationLevel.level.new]}`,
          },
        ),
    ],
  }))
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
        ].map(option => ({ ...option, default: setting?.changeVerificationLevel.level.new === Number(option.value) }))),
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

// 自動アナウンス公開
ControlPanelMessages.set(FeatureType.AutoPublic, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: 自動アナウンス公開')
        .setDescription('```設定したアナウンスチャンネルに投稿されたメッセージを自動で公開します。(BOTが投稿したメッセージは公開されません)```')
        .setColor(Colors.Blurple)
        .setFields(
          {
            name: '一般設定',
            value: booleanStatus(setting?.autoPublic.enable),
            inline: true,
          },
          {
            name: 'チャンネル',
            value: setting?.autoPublic.channels.map(v => channelMention(v)).join(' ') || 'なし',
            inline: true,
          },
        ),
    ],
  }))
  .addActionRows((setting) => [
    new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('nonick-js:setting-autoPublic-channels')
        .setPlaceholder('チャンネルを選択')
        .setChannelTypes(ChannelType.GuildAnnouncement)
        .setMinValues(0)
        .setMaxValues(5),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-autoPublic-enable')
        .setLabel(buttonLabelStatus(setting?.autoPublic.enable))
        .setStyle(buttonStyleStatus(setting?.autoPublic.enable)),
    ),
  ], { name: '一般設定', emoji: WhiteEmojies.setting }),
);

// AutoMod Plus
ControlPanelMessages.set(FeatureType.AutoModPlus, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: AutoMod Plus')
        .setDescription('```標準のAutoModでは設定が難しい、高度なメッセージフィルターを有効にします。フィルターに検知されたメッセージは自動的に削除されます。```')
        .setColor(Colors.Blurple)
        .setFields(
          {
            name: '一般設定',
            value: [
              booleanStatus(setting?.autoMod.enable),
              `${formatEmoji(GrayEmojies.text)} **フィルタ:** ${Object.entries(setting?.autoMod.filter || {}).filter(v => v[1]).map(v => inlineCode(autoModFilter.get(v[0])!)).join(' ') || 'なし'}`,
            ].join('\n'),
            inline: true,
          },
          {
            name: 'ログ設定',
            value: `${booleanStatus(setting?.autoMod.log.enable)}\n${channelStatus(setting?.autoMod.log.channel)}`,
            inline: true,
          },
          {
            name: '例外設定',
            value: [
              `${formatEmoji(GrayEmojies.channel)} **チャンネル:** ${setting?.autoMod.ignore.channels.map(v => channelMention(v)).join(' ') || 'なし'}`,
              `${formatEmoji(GrayEmojies.member)} **ロール:** ${setting?.autoMod.ignore.roles.map(v => roleMention(v)).join(' ') || 'なし'}`,
            ].join('\n'),
          },
        )
        .setFooter({ text: 'Tips:「サーバー管理」権限を持つユーザーはこのフィルターに検知されなくなります。' }),
    ],
  }))
  .addActionRows((setting) => [
    new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
      new StringSelectMenuBuilder()
        .setCustomId('nonick-js:setting-automod-filter')
        .setPlaceholder('有効にするフィルタを選択')
        .setMinValues(0)
        .setMaxValues(3)
        .setOptions(
          [
            { label: 'このサーバー以外の招待リンク', value: 'inviteUrl', emoji: WhiteEmojies.message },
            { label: 'Discordトークン', value: 'token', emoji: WhiteEmojies.message },
            { label: '短縮URL', value: 'shortUrl', emoji: WhiteEmojies.message },
          ].map(options => ({ ...options, default: Object.entries(setting?.autoMod.filter || {}).filter(v => v[1]).map(v => v[0]).includes(options.value) })),
        ),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-automod-enable')
        .setLabel(buttonLabelStatus(setting?.autoMod.enable))
        .setStyle(buttonStyleStatus(setting?.autoMod.enable)),
    ),
  ], { name: '一般設定', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-automod-log-enable')
        .setLabel(buttonLabelStatus(setting?.autoMod.log.enable))
        .setStyle(buttonStyleStatus(setting?.autoMod.log.enable))
        .setDisabled(!setting?.autoMod.log.channel),
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-automod-log-channel')
        .setLabel('送信先')
        .setEmoji(WhiteEmojies.channel)
        .setStyle(ButtonStyle.Secondary),
    ),
  ], { name: 'ログ設定', description: 'メッセージがブロックされた際にログを送信', emoji: WhiteEmojies.setting })
  .addActionRows((setting) => [
    new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('nonick-js:setting-automod-ignore-channels')
        .setPlaceholder('例外設定 (チャンネル)')
        .setChannelTypes([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildVoice, ChannelType.GuildStageVoice])
        .setMinValues(0)
        .setMaxValues(25),
    ),
    new ActionRowBuilder<RoleSelectMenuBuilder>().setComponents(
      new RoleSelectMenuBuilder()
        .setCustomId('nonick-js:setting-automod-ignore-roles')
        .setPlaceholder('例外設定 (ロール)')
        .setMinValues(0)
        .setMaxValues(25),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-automod-ignore-deleteAll')
        .setLabel('全ての例外設定を削除')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(!(setting?.autoMod.ignore.channels.length || setting?.autoMod.ignore.roles.length)),
    ),
  ], { name: '例外設定', description: 'フィルタに影響しないチャンネル/ロールを設定', emoji: WhiteEmojies.setting }),
);

// 自動スレッド作成
ControlPanelMessages.set(FeatureType.AutoCreateThread, new ControlPanelComponentPagination()
  .setMessageOptions((setting) => ({
    embeds: [
      new EmbedBuilder()
        .setTitle('`🔧` 設定: 自動スレッド作成')
        .setDescription('```設定したチャンネルにメッセージが送信された際、スレッドを自動で作成します。(BOTが投稿したメッセージや返信時は作成されません)```')
        .setColor(Colors.Blurple)
        .setFields(
          {
            name: '一般設定',
            value: booleanStatus(setting?.autoCreateThread.enable),
            inline: true,
          },
          {
            name: 'チャンネル',
            value: setting?.autoCreateThread.channels.map(v => channelMention(v)).join(' ') || 'なし',
            inline: true,
          },
        ),
    ],
  }))
  .addActionRows((setting) => [
    new ActionRowBuilder<ChannelSelectMenuBuilder>().setComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId('nonick-js:setting-autoCreateThread-channels')
        .setPlaceholder('チャンネルを選択')
        .setChannelTypes(ChannelType.GuildText)
        .setMinValues(0)
        .setMaxValues(5),
    ),
    new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:setting-autoCreateThread-enable')
        .setLabel(buttonLabelStatus(setting?.autoCreateThread.enable))
        .setStyle(buttonStyleStatus(setting?.autoCreateThread.enable)),
    ),
  ], { name: '一般設定', emoji: WhiteEmojies.setting }),
);