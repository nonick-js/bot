const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 The use of **${username}** on this server is prohibited by the developer.`, 'Please contact `nonick-mc#1017` for more information and the reason for the ban.'].join('\n'),

    'INFO_DESCRIPTION': '**“Easy to use” is the motto of Completely free multifunctional BOT!**\nWe are developing a BOT that anyone can use easily!\n\n🔹**Features**\n`WelcomeMessage` `ReportContextMenu` `ReactionRole` `MusicPlayback` `/timeout` `/ban`',
    'INFO_FOOTER_TEXT': 'Developer・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'Support Server',

    'SETTING_LANGUAGE': 'Please select the language you wish to use.',
    'SETTING_NEW_LANGUAGE': '🇺🇸 The language used has been changed to **English (US)**!',
};

const translate = (key, ...args) => {
    const translation = languageData[key];
    if (!translation) {
        const JPLanguage = require('./ja_JP');
        return JPLanguage(key, ...args);
    }
    if (typeof translation === 'function') return translation(args);
    else return translation;
};

module.exports = translate;