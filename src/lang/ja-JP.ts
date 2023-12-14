import type { LangData } from '@modules/translate';
import { bold, inlineCode } from 'discord.js';
import { langs } from 'lang';
import type { LangTemplate } from './template';

export const ja_JP: LangData<LangTemplate> = {
  'eventLog.voice.join.title': () => 'チャンネル参加',
  'eventLog.voice.leave.title': () => 'チャンネル退出',
  'eventLog.voice.move.title': () => 'チャンネル移動',
  'eventLog.voice.move.old': () => 'チャンネル移動元',
  'eventLog.voice.move.new': () => 'チャンネル移動先',

  'eventLog.ban.remove.title': () => `${inlineCode('🔨')} BAN解除`,

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

  'commands.help.description': () => 'このBOTについて',

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
    `サーバーの認証レベルを${bold(langs.tl(level))}に変更しました`,
  'label.rule': () => 'ルール',
  'label.supportServer': () => 'サポートサーバー',
  'label.documents': () => '使い方ガイド',
  'label.aboutBot.0': () => 'サーバーの運営・成長に役立つ機能を搭載！',
  'label.aboutBot.1': () =>
    '「完全無料で使いやすい多機能BOT」を目指して日々開発しています',
  'label.developer': (developer) => `開発者: ${developer}`,

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
};
