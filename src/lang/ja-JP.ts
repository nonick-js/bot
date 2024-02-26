import { Duration } from '@modules/format';
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
  'commands.reload.description': () => 'BOTを再起動する',
  'commands.status.description': () => 'BOTのステータスを表示する',
  'commands.bulkdelete.description': () =>
    'このチャンネルに送信されたメッセージを最新順に一括削除 (2週間前まで)',
  'commands.firstmessage.description': () =>
    'チャンネルの最初に投稿されたメッセージのURLボタンを送信',
  'commands.ratelimit.description': () => 'このチャンネルの低速モードを設定',
  'commands.timeout.description': () =>
    'ユーザーをタイムアウト (公式の機能より柔軟な設定が可能)',
  'commands.pauseinvite.description': () =>
    'サーバー招待の一時停止状態を切り替えます',

  'commands.bulkdelete.messages.description': () => '削除するメッセージの数',
  'commands.firstmessage.context.description': () => 'メッセージ',
  'commands.firstmessage.label.description': () => 'ボタンのテキスト',
  'commands.ratelimit.duration.description': () => '秒数',
  'commands.timeout.user.description': () => 'ユーザー',
  'commands.timeout.date.description': () => '日',
  'commands.timeout.hour.description': () => '時',
  'commands.timeout.minute.description': () => '分',
  'commands.timeout.reason.description': () => '理由',
  'commands.pauseinvite.pause.description': () => '一時停止するか',
  'commands.verify.description': () => 'ロールを使用した認証パネルを作成',
  'commands.verify.type.description': () => '認証タイプ',
  'commands.verify.type.button': () => 'ボタン',
  'commands.verify.type.image': () => '画像',
  'commands.verify.role.description': () => '認証成功時に付与するロール',
  'commands.verify.description.description': () =>
    '埋め込みの説明文 (半角スペース2つで改行)',
  'commands.verify.color.description': () => '埋め込みの色',

  'contexts.infouser.name': () => 'ユーザーの情報',

  'label.target': () => '対象者',
  'label.channel': () => 'チャンネル',
  'label.executor': () => '実行者',
  'label.member': () => 'メンバー',
  'label.schedule': () => 'スケジュール',
  'label.timeoutSchedule': () => 'タイムアウトが解除される日時',
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
  'label.commandHasCoolTime': () =>
    `${inlineCode('⌛')} コマンドはクールタイム中です`,
  'label.notPermitted': () => '権限がありません',
  'label.notCommandPermission': () => 'コマンドの実行権限がありません',
  'label.notEnoughBotPermission': () => 'BOTの権限が不足しています',
  'label.status': () => 'ステータス',
  'label.roles': () => 'ロール',
  'label.serverId': () => 'サーバーID',
  'label.owner': () => 'オーナー',
  'label.memberCount': () => 'メンバー数',
  'label.channelCount': () => 'チャンネル数',
  'label.serverCreateAt': () => 'サーバー作成日',
  'label.boostCount': () => 'ブースト数',
  'label.userId': () => 'ユーザーID',
  'label.nickname': () => 'ニックネーム',
  'label.notMember': () => 'このユーザーはこのサーバーにいません',
  'label.accountCreateAt': () => 'アカウント作成日',
  'label.badges': () => 'バッジ',
  'label.serverJoinAt': () => 'サーバー参加日',
  'label.error': () => 'エラー',
  'label.boostSince': () => 'ブースト開始日',
  'label.color.red': () => '🔴赤色',
  'label.color.orange': () => '🟠橙色',
  'label.color.yellow': () => '🟡黄色',
  'label.color.green': () => '🟢緑色',
  'label.color.blue': () => '🔵青色',
  'label.color.purple': () => '🟣紫色',
  'label.color.white': () => '⚪白色',
  'label.color.black': () => '⚫黒色',
  'label.verify': () => '認証',

  'label.bulkdelete.failed': () =>
    `${inlineCode('❌')} メッセージの削除に失敗しました`,
  'label.bulkdelete.success': (count) =>
    `${inlineCode('✅')} メッセージを${inlineCode(`${count}件`)}削除しました`,
  'label.firstmessage.failed': () =>
    `${inlineCode('❌')} メッセージを取得できませんでした`,
  'label.ratelimit.failed': () =>
    `${inlineCode('❌')} 低速モードの設定に失敗しました`,
  'label.ratelimit.success': (duration) =>
    `${inlineCode('✅')} チャンネルの低速モードを${inlineCode(
      `${duration}秒`,
    )}に設定しました`,
  'label.timeout.failed.notExistsMember': () =>
    `${inlineCode('❌')} このユーザーはサーバーにいません`,
  'label.timeout.failed.notEnoughTime': () =>
    `${inlineCode('❌')} 合計時間は1分以上から設定できます`,
  'label.timeout.failed.timeTooMany': () =>
    `${inlineCode('❌')} 28日以上のタイムアウトはできません`,
  'label.timeout.failed.yourself': () =>
    `${inlineCode('❌')} 自分自身を対象にすることはできません`,
  'label.timeout.failed.notPermittedTimeout': () =>
    `${inlineCode('❌')} このユーザーをタイムアウトする権限がありません`,
  'label.timeout.failed': () =>
    `${inlineCode('❌')} タイムアウトに失敗しました`,
  'label.timeout.success': (member, duration) =>
    `${inlineCode('✅')} ${member}を${Duration.format(
      duration,
      `${bold('%{d}')}日${bold('%{h}')}時間${bold('%{m}')}分`,
    )}タイムアウトしました`,
  'label.pauseinvite.failed.alreadyDone': () =>
    `${inlineCode('❌')} 既にその状態です`,
  'label.pauseinvite.failed': () =>
    `${inlineCode('❌')} 招待一時停止状態の変更に失敗しました`,
  'label.pauseinvite.success': (state) =>
    `${inlineCode('✅')} サーバー招待を${langs.tl(state)}しました`,
  'label.verify.failed.unusableRole': () =>
    `${inlineCode('❌')} そのロールは認証に使用することはできません`,
  'label.verify.failed.higherRole': () =>
    `${inlineCode(
      '❌',
    )} 自分の持つロールより上のロールを認証に使用することはできません`,
  'label.verify.failed.botHigherRole': () =>
    `${inlineCode(
      '❌',
    )} BOTの持つロールより上のロールを認証に使用することはできません`,
  'label.verify.failed.inProgress': () =>
    `${inlineCode(
      '❌',
    )} 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。`,
  'label.verify.failed.alreadyDone': () =>
    `${inlineCode('✅')} 既に認証されています。`,
  'label.verify.failed.grantRole': () =>
    `${inlineCode(
      '❌',
    )} ロールを付与できませんでした。サーバーの管理者にご連絡ください`,
  'label.verify.failed.sendDM': () =>
    `${inlineCode(
      '❌',
    )} この認証を行うにはBOTからDMを受け取れるように設定する必要があります。`,
  'label.verify.failed.tryCountsExceeded': () =>
    `${inlineCode(
      '❌',
    )} 試行回数を超えて検証に失敗しました。次回の検証は${inlineCode(
      '5分後',
    )}から可能になります。`,

  'label.verify.failed': () =>
    `${inlineCode('❌')} 認証中に問題が発生しました。`,
  'label.verify.success': () => `${inlineCode('✅')} 認証に成功しました！`,
  'label.verify.giveRole': () => '付与するロール',
  'label.verify.image.description': () =>
    [
      '下の画像に表示された、緑色の文字列をこのDMに送信してください。',
      '> ⚠️一定時間経過したり、複数回間違えると新しい認証を発行する必要があります。',
    ].join('\n'),
  'label.verify.image.footer': () =>
    'NoNICK.jsはパスワードの入力やQRコードの読み取りを要求することは決してありません。',
  'label.verify.image': () => '画像認証',
  'label.verify.inductionDM': () =>
    `${inlineCode('📨')} DMで認証を続けてください。`,

  'label.permission.manageMessages': () => 'メッセージの管理',
  'label.permission.manageChannels': () => 'チャンネルの管理',
  'label.permission.manageRoles': () => 'ロールの管理',

  'label.guildFeature.PARTNERED': () => 'パートナー鯖',
  'label.guildFeature.VERIFIED': () => '認証済み',
  'label.guildFeature.DISCOVERABLE': () => '公開サーバー',

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

  'label.firstmessage.default': () => '最上部へ移動',
  'label.pauseinvite.enable': () => '有効に',
  'label.pauseinvite.pause': () => '一時停止',
  'label.pauseinvite.reason.pause': (user) => `招待の一時停止 - ${user.tag}`,
  'label.pauseinvite.reason.enable': (user) => `招待の有効化 - ${user.tag}`,
};
