const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 このサーバーでの**${username}**の使用は開発者により禁止されています。`, '禁止された理由や詳細は`nonick-mc#1017`までお問い合わせください。'].join('\n'),

    'INFO_DESCRIPTION': '「使いやすい」をモットーにした**完全無料の多機能BOT!**\n誰でも簡単にBOTを使えるような開発をしています!\n\n🔹**搭載中の機能**\n`入退室ログ` `通報機能` `リアクションロール` `音楽再生機能` `timeoutコマンド` `banコマンド`',
    'INFO_FOOTER_TEXT': '開発者・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'サポートサーバー',

    'SETTING_LANGUAGE': '使用する言語を選択してください。',
    'SETTING_NEW_LANGUAGE': '🇯🇵 使用する言語を**日本語**に変更しました!',
};

const translate = (key, ...args) => {
    const translation = languageData[key];
    if (!translation) return '<language error>';
    if (typeof translation === 'function') return translation(args);
    else return translation;
};

module.exports = translate;