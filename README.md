# NoNICK.js
「分かりやすい」をモットーに開発した、完全無料で使える多機能DiscordBOT

# ✨Requirement
このBOTは以下のnpmパッケージを使用しています。

* @djs-tools/interactions@1.0.3
* @octokit/rest@19.0.4
* axios@0.27.2
* discord-api-types@0.37.5
* discord.js@14.3.0
* dotenv@16.0.2
* eslint@8.23.0 (必須ではない)
* mysql2@2.3.3
* node-cron@3.0.2
* octokit@2.0.7
* sequelize@6.21.6
* sqlite3@5.0.11 (SQLiteを使用する場合のみ)

# 🔮Installation
Release欄から必要に応じたバージョンのソースコードをダウンロードしましょう。  
また、以下のコマンドをコンソールに入力することで必要なライブラリをインストールできます。(node.jsが必要です)
```npm
npm i
```

# 💻Usage
このBOTを起動する前に、BOTのトークンを保存する`.env`とBOTの設定を保存する`config.json`の２つのファイルを用意する必要があります。

① `.env.sample`を基に、`index.js`と同じディレクトリに`.env`ファイルを作成します
② `config.json` を`index.js`と同じディレクトリに作成します。
```json
{
    "$schema": "./.schema.json",
    "clientId":"BOTのクライアントID",
    "guildId":"スラッシュコマンドを登録するサーバーのID",
    "guildCommand": true,

    "blackList": {
        "guilds": ["BOTの使用を制限するサーバーのID"],
        "users": ["BOTの使用を制限するユーザーのID (このユーザーがオーナーのサーバーが使用できなくなります)"]
    }
}
```
ヒント: `"$schema": "./.schema.json"`をjsonファイルに追加すると、設定項目の候補表示が有効になります。

③ 以上の設定が終わったら、ターミナルで `node .` と入力することでBOTの起動が可能です。

# 📑Files
* index.js... NoNICK.jsを起動するファイル。
* resetCommand.js... BOTに登録されているコマンドをすべて削除するファイル `config.json`の`guildCommand`がtrueになっている場合はギルドコマンドも全て削除されます。
* sqliteToMysql_v3.0.js... v3.0準拠のSQLiteからMySQLへデータを移行できるファイル
* syncSQLite_v3.0.. v2.1以下のSQLiteをv3.0準拠のSQLiteに変換するファイル

# 🎓License
* 自作発言をしない限り、MITライセンスに基づいた使用が可能となります。