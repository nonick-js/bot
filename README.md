# NoNICK.js
[![Discord Support](https://img.shields.io/discord/949877204601405482?label=discord&logo=discord&logoColor=white)](https://discord.gg/fVcjCNn733)
[![GitHub License](https://img.shields.io/github/license/nonick-mc/DiscordBot-NoNick.js)](LICENSE)  
サーバー運営をサポートする機能を搭載した多機能BOTです。

# 機能
* 🚪入退室ログ
* 📢サーバー内通報
* 🔗メッセージURL展開
* 📝イベントログ
  * タイムアウト
  * キック
  * BAN
  * ボイスチャットの入退室
* ✅自動認証レベル変更
* ✋AutoMod Plus
* 💻豊富なコマンド
  * `/timeout` ... ユーザーを最大28日タイムアウト
  * `/embed` ... 埋め込みを作成 (作成した埋め込みにはロール付与ボタン等をつけることが可能)
  * `/verify` ... ロール付与に特定のステップを要求する認証パネルを作成
  * `/bulkdelete` ... メッセージを指定した数だけ削除
  * `/ratelimit` ... チャンネルの低速モードを1秒単位で指定
  * `/firstmessage` ... チャンネルで最初に送信されたメッセージのURLボタンを送信

## 環境変数
```env
BOT_TOKEN="DiscordBOTのトークン"
GUILD_ID="コマンドを登録するサーバーのID (省略した際はグローバルコマンドとして登録)"
LOG_CHANNEL_ID="エラーログを送信するチャンネルのID"

MONGODB_URI="mongoDBに接続するためのURI"
MONGODB_DBNAME="データベース名"
```

## サポート
BOTの使い方や設定の仕方は、[公式ドキュメント](https://docs.nonick-js.com)を使用して確認することが出来ます。  
尚、ドキュメントを読んでもわからない場合は、[サポートサーバー](https://discord.gg/fVcjCNn733)で質問することもできます。

## 貢献
バグや脆弱性を発見したり、搭載してほしい機能がある場合は、このリポジトリからIssueを新規作成するか、[サポートサーバー](https://discord.gg/fVcjCNn733)から開発者に連絡してください！  
いずれの場合も、既に同じ内容が投稿されていないか確認してください。