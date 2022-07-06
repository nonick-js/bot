const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 The use of **${username}** on this server is prohibited by the developer.`, 'Please contact `nonick-mc#1017` for more information and the reason for the ban.'].join('\n'),

    'INFO_DESCRIPTION': '**“Easy to use” is the motto of Completely free multifunctional BOT!**\nWe are developing a BOT that anyone can use easily!\n\n🔹**Features**\n`WelcomeMessage` `ReportContextMenu` `ReactionRole` `MusicPlayback` `/timeout` `/ban`',
    'INFO_FOOTER_TEXT': 'Developer・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'Support Server',

    'SETTING_PERMISSION_ERROR': '❌ **You are not authorized to do this!**\nRequired Permissions: `Manage Server`',
    'SETTING_CHANNEL_ENABLE': (emoji, ch) => `${emoji}Enable <#${ch}>`,
    'SETTING_CHANNEL_DISABLE': (emoji) => `${emoji}Disable`,
    'SETTING_BUTTON_ENABLE': 'Enable',
    'SETTING_BUTTON_DISABLE': 'Disable',
    'SETTING_BUTTON_CH': 'Channel',
    'SETTING_BUTTON_MESSAGE': 'Message',
    'SETTING_NONE': 'none',

    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - Setting`,
    'SETTING_HOME_DESCRIPTION': (username) => `Welcome to ${username} control panel!\nHere you can change the settings for this BOT!\n\`\`\`\nSelect the settings you want to view or change from the select menu!\n\`\`\``,

    'SETTING_WELCOMEMESSAGE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 Setting - Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```This function notifies you when a new member joins or leaves the server. You can set up a message to send information that you want the person who joined to see.\n```\n**【Current settings】**',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE_DESCRIPTION': 'Send a message when a member joins',
    'SETTING_WELCOMEMESSAGE_FIELD_LEAVEMESSAGE': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_FIELD_LEAVEMESSAGE_DESCRIPTION': 'Send a message when a member leaves',
    'SETTING_WELCOMEMESSAGE_FIELD_WELCOMEMESSAGE_CUSTOM': 'Custom Welcome Message',

    'SETTING_REPORT': 'Report Cotextmenu',
    'SETTING_MESSAGELINKEXPANSION': 'Message Link Expansion',

    'SETTING_LANGUAGE_TITLE': '🌍 Language Setting',
    'SETTING_LANGUAGE_DESCRIPTION': 'Please select the language you wish to use.',
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