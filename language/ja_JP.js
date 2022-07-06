const languageData = {
    'BLACKLIST_MESSAGE': (username) => `🚫 このサーバーでの**${username}**の使用は開発者により禁止されています。禁止された理由や詳細は\`nonick-mc#1017\`までお問い合わせください。`,

    'INFO_DESCRIPTION': '「使いやすい」をモットーにした**完全無料の多機能BOT!**\n誰でも簡単にBOTを使えるような開発をしています!\n\n🔹**搭載中の機能**\n`入退室ログ` `通報機能` `リアクションロール` `音楽再生機能` `timeoutコマンド` `banコマンド`',
    'INFO_FOOTER_TEXT': '開発者・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'サポートサーバー',

    'SETTING_PERMISSION_ERROR': '❌ **あなたにはこれを実行する権限がありません！**\n必要な権限: `サーバー管理`',
    'SETTING_CHANNEL_ENABLE': (emoji, ch) => `${emoji}有効 <#${ch}>`,
    'SETTING_CHANNEL_DISABLE': (emoji) => `${emoji}無効`,
    'SETTING_BUTTON_ENABLE': '有効化',
    'SETTING_BUTTON_DISABLE': '無効化',
    'SETTING_BUTTON_CH': '送信先',
    'SETTING_BUTTON_MESSAGE': 'メッセージ',
    'SETTING_NONE': '設定されていません',

    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - 設定`,
    'SETTING_HOME_DESCRIPTION': (username) => `${username}のコントロールパネルへようこそ!\nここではこのBOTの設定を変更することができます!\n\`\`\`\nセレクトメニューから閲覧・変更したい設定を選択しよう!\n\`\`\``,

    'SETTING_WELCOMEMESSAGE': '入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 設定 - 入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。\n```\n**【現在の設定】**',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE': '入室ログ',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE_DESCRIPTION': 'メンバー参加時にメッセージを送信',
    'SETTING_WELCOMEMESSAGE_FIELD_LEAVEMESSAGE': '退室ログ',
    'SETTING_WELCOMEMESSAGE_FIELD_LEAVEMESSAGE_DESCRIPTION': 'メンバー退室時にメッセージを送信',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE_CUSTOM': '入室ログメッセージ',

    'SETTING_REPORT': '通報機能',
    'SETTING_MESSAGELINKEXPANSION': 'リンク展開',

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