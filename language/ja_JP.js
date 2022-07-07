const discord = require('discord.js');
const languageData = {
    'BLACKLIST_MESSAGE': (username) => `🚫 このサーバーでの**${username}**の使用は開発者により禁止されています。禁止された理由や詳細は\`nonick-mc#1017\`までお問い合わせください。`,

    'INFO_DESCRIPTION': '「使いやすい」をモットーにした**完全無料の多機能BOT!**\n誰でも簡単にBOTを使えるような開発をしています!\n\n🔹**搭載中の機能**\n`入退室ログ` `通報機能` `リアクションロール` `音楽再生機能` `timeoutコマンド` `banコマンド`',
    'INFO_FOOTER_TEXT': '開発者・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'サポートサーバー',

    'SETTING_PERMISSION_ERROR': '❌ **あなたにはこれを実行する権限がありません！**\n必要な権限: `サーバー管理`',
    'SETTING_DISABLE': `${discord.Formatters.formatEmoji('758380151238033419')} 無効`,
    'SETTING_ENABLE': `${discord.Formatters.formatEmoji('758380151544217670')} 有効`,
    'SETTING_CHANNEL_ENABLE': (ch) => `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<#${ch}>)`,
    'SETTING_ROLE_ENABLE': (role) => `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<@&${role}>)`,
    'SETTING_BUTTON_ENABLE': '有効化',
    'SETTING_BUTTON_DISABLE': '無効化',
    'SETTING_BUTTON_CH': '送信先',
    'SETTING_BUTTON_MESSAGE': 'メッセージ',
    'SETTING_BUTTON_ROLE': 'ロール',
    'SETTING_NONE': '__設定されていません__',
    'SETTING_CH_SUCCESS_DESCRIPTION': (name) => `✅ **${name}**がここに送信されます!`,
    'SETTING_ERROR_TITLE': 'エラー!',
    'SETTING_ERROR_NOTPERMISSION': '⚠️ **BOTの権限が不足しています!**\n必要な権限: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
    'SETTING_ERROR_CHANNELNOTFOUND': (name) => `⚠️ ${discord.Formatters.inlineCode(name)}という名前のチャンネルは存在しません!`,
    'SETTING_ERROR_ROLENOTFOUND': (name) => `⚠️ ${discord.Formatters.inlineCode(name)}という名前のロールは存在しません!`,

    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - 設定`,
    'SETTING_HOME_DESCRIPTION': (username) => `${username}のコントロールパネルへようこそ!\nここではこのBOTの設定を変更することができます!\n\`\`\`\nセレクトメニューから閲覧・変更したい設定を選択しよう!\n\`\`\``,

    'SETTING_WELCOMEMESSAGE': '入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 設定 - 入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。```\n**【現在の設定】**',
    'SETTING_WELCOMEMESSAGE_EMBED_FIELD_1': '入室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_FIELD_2': '退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_FIELD_3': '入室ログメッセージ',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_TITLE': '入室ログ',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_LABEL': '送信先のチャンネル名',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_TITLE': '退室ログ',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_LABEL': 'チャンネル名',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_TITLE': 'Welcomeメッセージ',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_LABEL': '入室ログに表示するメッセージを入力してください。',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_PLACEHOLDER': '<#チャンネルID>や<@ユーザーID>、<@&ロールID> と入力することでそれぞれメンションが可能です!',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_1': '入室ログ',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_1': 'メンバー参加時にメッセージを送信',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_2': '退室ログ',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_2': 'メンバー退室時にメッセージを送信',

    'SETTING_REPORT': '通報機能',
    'SETTING_REPORT_EMBED_TITLE': '🛠 設定 - 通報機能',
    'SETTING_REPORT_EMBED_DESCRIPTION': '**Tips**: コンテキストメニュー自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。\n```メンバーがサーバールール等に違反しているメッセージを通報できる機能です。モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。```\n**【現在の設定】**',
    'SETTING_REPORT_EMBED_FIELD_1': '通報の送信先',
    'SETTING_REPORT_EMBED_FIELD_2': 'ロールメンション',
    'SETTING_REPORT_SELECT_TITLE_1': '全般設定',
    'SETTING_REPORT_SELECT_TITLE_2': 'ロールメンション機能',
    'SETTING_REPORT_SELECT_DESCRIPTION_2': '通報受け取り時にロールをメンション',
    'SETTING_REPORT_REPORTCH_MODAL_TITLE': '送信先',
    'SETTING_REPORT_REPORTCH_MODAL_LABEL': 'チャンネル名',
    'SETTING_REPORT_REPORTROLE_MODAL_TITLE': 'ロールメンション',
    'SETTING_REPORT_REPORTROLE_MODAL_LABEL': 'ロール名',

    'SETTING_MESSAGELINKEXPANSION': 'リンク展開',
    'SETTING_MESSAGELINKEXPANSION_EMBED_TITLE': '🛠 設定 - リンク展開',
    'SETTING_MESSAGELINKEXPANSION_EMBED_DESCRIPTION': '```\nDiscordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。\n流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。\n```\n**【現在の設定】**',
    'SETTING_MESSAGELINKEXPANSION_EMBED_FIELD_1': 'リンク展開',
    'SETTING_MESSAGELINKEXPANSION_SELECT_TITLE_1': '全般設定',

    'SETTING_MUSIC': '音楽再生',
    'SETTING_MUSIC_EMBED_TITLE': '🛠 設定 - 音楽再生',
    'SETTING_MUSIC_EMBED_DESCRIPTION': '**Tips**: スラッシュコマンド自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。\n```YoutubeやSpotify、SoundCloudにある音楽をVCで再生することができます。ボイスチャット内で音楽を再生させたい時に便利です。```\n\n**【現在の設定】**',
    'SETTING_MUSIC_EMBED_FIELD_1': 'DJモード',
    'SETTING_MUSIC_EMBED_FIELD_2': '❓DJモードとは',
    'SETTING_MUSIC_EMBED_FIELD_2_VALUE': 'musicコマンドや再生パネルの使用を、指定したロールを持つメンバーと管理者権限をもつメンバーのみ許可します。\n大規模なサーバーで使用する場合やVC荒らしを防止するために、**この設定を有効にすることをおすすめします。**',
    'SETTING_MUSIC_SELECT_TITLE_1': 'DJモード',
    'SETTING_MUSIC_DJROLE_MODAL_TITLE': 'DJモード',
    'SETTING_MUSIC_DJROLE_MODAL_LABEL': 'ロール名',

    'SETTING_LANGUAGE_TITLE': '🌍 言語設定',
    'SETTING_LANGUAGE_DESCRIPTION': '使用する言語を選択してください。',
};

const translate = (key, ...args) => {
    const translation = languageData[key];
    if (!translation) return '<language error>';
    if (typeof translation === 'function') return translation(args);
    else return translation;
};

module.exports = translate;