const discord = require('discord.js');
const languageData = {
    'BLACKLIST_MESSAGE': (username) => `🚫 このサーバーでの**${username}**の使用は開発者により禁止されています。禁止された理由や詳細は\`nonick-mc#1017\`までお問い合わせください。`,

    'INFO_DESCRIPTION': '「使いやすい」をモットーにした**完全無料の多機能BOT!**\n誰でも簡単にBOTを使えるような開発をしています!\n\n🔹**搭載中の機能**\n`入退室ログ` `通報機能` `リアクションロール` `音楽再生機能` `timeoutコマンド` `banコマンド`',
    'INFO_FOOTER_TEXT': '開発者・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'サポートサーバー',

    'SETTING_PERMISSION_ERROR': '❌ **あなたにはこれを実行する権限がありません！**\n必要な権限: `サーバー管理`',
    'SETTING_DISABLE': `${discord.Formatters.formatEmoji('758380151238033419')} 無効`,
    'SETTING_CHANNEL_ENABLE': (ch) => `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<#${ch}>)`,
    'SETTING_BUTTON_ENABLE': '有効化',
    'SETTING_BUTTON_DISABLE': '無効化',
    'SETTING_BUTTON_CH': '送信先',
    'SETTING_BUTTON_MESSAGE': 'メッセージ',
    'SETTING_NONE': '設定されていません',
    'SETTING_CH_SUCCESS_DESCRIPTION': (name) => `✅ **${name}**がここに送信されます!`,
    'SETTING_ERROR_TITLE': 'エラー!',
    'SETTING_ERROR_NOTPERMISSION': '⚠️ **BOTの権限が不足しています!**\n必要な権限: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
    'SETTING_ERROR_CHANNELNOTFOUND': (name) => `⚠️ ${discord.Formatters.inlineCode(name)}という名前のチャンネルは存在しません!`,

    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - 設定`,
    'SETTING_HOME_DESCRIPTION': (username) => `${username}のコントロールパネルへようこそ!\nここではこのBOTの設定を変更することができます!\n\`\`\`\nセレクトメニューから閲覧・変更したい設定を選択しよう!\n\`\`\``,

    'SETTING_WELCOMEMESSAGE': '入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 設定 - 入退室ログ',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。\n```\n**【現在の設定】**',
    'SETTING_WELCOMEMESSAGE_FIELD_1': '入室ログ',
    'SETTING_WELCOMEMESSAGE_FIELD_2': '退室ログ',
    'SETTING_WELCOMEMESSAGE_FIELD_3': '入室ログメッセージ',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_TITLE': '入室ログ',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_LABEL': '送信先のチャンネル名',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_TITLE': '退室ログ',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_LABEL': '送信先のチャンネル名',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_TITLE': 'Welcomeメッセージ',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_LABEL': '入室ログに表示するメッセージを入力してください。',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_PLACEHOLDER': '<#チャンネルID>や<@ユーザーID>、<@&ロールID> と入力することでそれぞれメンションが可能です!',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_1': '入室ログ',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_1': 'メンバー参加時にメッセージを送信',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_2': '退室ログ',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_2': 'メンバー退室時にメッセージを送信',

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