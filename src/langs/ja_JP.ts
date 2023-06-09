import { langKeys } from './langKeys';
import { LangKey, langData, tl } from './index';

const lang: langData = {
  [langKeys.featureTitle](title) {
    return `\`🔧\` 設定: ${tl({ key: title as LangKey }, this.lang)}`;
  },
  [langKeys.joinLeaveMsgTitle]: '入退室メッセージ',
  [langKeys.joinLeaveMsgDescription]: 'メンバーがサーバーに参加したり脱退したりした際にメッセージを送信します。(メッセージは各設定の「プレビュー」ボタンで確認できます。)',
  [langKeys.inServerRptTitle]: 'サーバー内通報',
  [langKeys.inServerRptDescription]: 'メンバーがルールに違反したメッセージやユーザーをモデレーターに通報できるようになります。',
  [langKeys.messageExpTitle]: 'メッセージURL展開',
  [langKeys.messageExpDescription]: 'DiscordのメッセージURLが送信された際に、そのメッセージの内容や送信者の情報を送信します。',
  [langKeys.eventLogTitle]: 'イベントログ',
  [langKeys.eventLogDescription]: 'サーバー内で起こったイベントのログを送信します。',
  [langKeys.chgVerifyLvTitle]: '自動認証レベル変更',
  [langKeys.chgVerifyLvDescription]: '決まった時間の間、サーバーの認証レベルを自動で変更します。',
  [langKeys.autoPublicTitle]: '自動アナウンス公開',
  [langKeys.autoPublicDescription]: '設定したアナウンスチャンネルに投稿されたメッセージを自動で公開します。',
  [langKeys.autoModPlusTitle]: 'AutoMod Plus',
  [langKeys.autoModPlusDescription]: '標準のAutoModでは設定が難しい、高度なメッセージフィルターを有効にします。フィルターに検知されたメッセージは自動的に削除されます。',
  [langKeys.autoThreadTitle]: '自動スレッド作成',
  [langKeys.autoThreadDescription]: '設定したチャンネルにメッセージが送信された際、スレッドを自動で作成します。',
}

export default lang;