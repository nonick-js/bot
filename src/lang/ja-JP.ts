import { blurple, gray } from '@const/emojis';
import type { LangData } from '@modules/translate';
import { escapeMarkdown, formatEmoji, inlineCode, time } from 'discord.js';
import { langs } from 'lang';
import type { LangTemplate } from './template';

export const ja_JP: LangData<LangTemplate> = {
  'eventLog.voice.join.title': () => 'チャンネル参加',
  'eventLog.voice.leave.title': () => 'チャンネル退出',
  'eventLog.voice.move.title': () => 'チャンネル移動',
  'eventLog.voice.move.old': () => 'チャンネル移動元',
  'eventLog.voice.move.new': () => 'チャンネル移動先',

  'eventLog.ban.add.title': () => `${inlineCode('🔨')} BAN`,
  'eventLog.ban.remove.title': () => `${inlineCode('🔨')} BAN解除`,

  'eventLog.kick.title': () => `${inlineCode('🔨')} Kick`,

  'eventLog.timeout.add.title': () => `${inlineCode('🛑')} タイムアウト`,
  'eventLog.timeout.remove.title': () =>
    `${inlineCode('🛑')} タイムアウト手動解除`,

  'eventLog.messageDelete.title': () => `${inlineCode('💬')} メッセージ削除`,

  'eventLog.messageEdit.title': () => `${inlineCode('💬')} メッセージ編集`,

  'message.expansion.title': () => 'メッセージ展開',

  'automation.publishAnnounce.failed': () =>
    `${inlineCode('❌')} メッセージの公開に失敗しました`,

  'automation.memberVerify.title': (label) =>
    `${inlineCode('✅')} 認証レベル自動変更 - ${langs.tl(label)}`,

  'label.target': () => '対象者',
  'label.channel': () => 'チャンネル',
  'label.executor': () => '実行者',
  'label.member': () => 'メンバー',
  'label.schedule': () => 'スケジュール',
  'label.timeoutSchedule': () => '解除される時間',
  'label.sender': () => '送信者',
  'label.sendAt': () => '送信時刻',
  'label.deleteBy': () => '削除者',
  'label.message': () => 'メッセージ',
  'label.sticker': () => 'スタンプ',
  'label.before': () => '変更前',
  'label.after': () => '変更後',
  'label.none': () => 'なし',
  'label.reason': () => '理由',
  'label.noReason': () => '理由が入力されていません',
  'label.newThread': () => '新しいスレッド',
  'label.start': () => '開始',
  'label.end': () => '終了',
  'label.changeVerify': (level) =>
    `サーバーの認証レベルを**${langs.tl(level)}**に変更しました`,
  'label.rule': () => 'ルール',

  'label.verifyLevel.0.name': () => '設定無し',
  'label.verifyLevel.0.description': () => '無制限',
  'label.verifyLevel.1.name': () => '低',
  'label.verifyLevel.1.description': () =>
    'メール認証がされているアカウントのみ',
  'label.verifyLevel.2.name': () => '中',
  'label.verifyLevel.2.description': () =>
    'Discordに登録してから5分以上経過したアカウントのみ',
  'label.verifyLevel.3.name': () => '高',
  'label.verifyLevel.3.description': () =>
    'このサーバーのメンバーとなってから10分以上経過したメンバーのみ',
  'label.verifyLevel.4.name': () => '最高',
  'label.verifyLevel.4.description': () => '電話認証がされているアカウントのみ',

  'label.autoMod.rule.inviteUrl': () => '招待URL',
  'label.autoMod.rule.token': () => 'トークン',
  'label.autoMod.rule.domain': () => '禁止されたドメイン',

  'fields.member': (user, label) =>
    `${formatEmoji(gray.member)} **${langs.tl(
      label ?? 'label.member',
    )}:** ${user.toString()} [${escapeMarkdown(user.tag)}]`,
  'fields.channel': (channel, label) =>
    `${formatEmoji(gray.channel)} **${langs.tl(
      label ?? 'label.channel',
    )}:** ${channel.toString()} [${escapeMarkdown(channel.name)}]`,

  'fields.schedule': (date, label) =>
    `${formatEmoji(gray.schedule)} **${langs.tl(
      label ?? 'label.schedule',
    )}:** ${time(date, 'f')} (${time(date, 'R')})`,

  'fields.executor': (user, label) =>
    `${formatEmoji(blurple.member)} **${langs.tl(
      label ?? 'label.executor',
    )}:** ${user.toString()} [${escapeMarkdown(user.tag)}]`,

  'fields.reason': (reason, label) =>
    `${formatEmoji(blurple.text)} **${langs.tl(
      label ?? 'label.reason',
    )}:** ${langs.tl(reason ?? 'label.noReason')}`,
};
