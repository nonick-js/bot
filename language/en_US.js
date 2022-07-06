const discord = require('discord.js');
const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 The use of **${username}** on this server is prohibited by the developer.`, 'Please contact `nonick-mc#1017` for more information and the reason for the ban.'].join('\n'),

    'INFO_DESCRIPTION': '**“Easy to use” is the motto of Completely free multifunctional BOT!**\nWe are developing a BOT that anyone can use easily!\n\n🔹**Features**\n`WelcomeMessage` `ReportContextMenu` `ReactionRole` `MusicPlayback` `/timeout` `/ban`',
    'INFO_FOOTER_TEXT': 'Developer・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'Support Server',

    'SETTING_PERMISSION_ERROR': '❌ **You are not authorized to do this!**\nRequired Permissions: `Manage Server`',
    'SETTING_DISABLE': `${discord.Formatters.formatEmoji('758380151238033419')} Disable`,
    'SETTING_CHANNEL_ENABLE': (ch) => `${discord.Formatters.formatEmoji('758380151544217670')} Enable (<#${ch}>)`,
    'SETTING_BUTTON_ENABLE': 'Enable',
    'SETTING_BUTTON_DISABLE': 'Disable',
    'SETTING_BUTTON_CH': 'Channel',
    'SETTING_BUTTON_MESSAGE': 'Message',
    'SETTING_NONE': 'none',
    'SETTING_CH_SUCCESS_DESCRIPTION': (name) => `✅ **${name}** will be sent here!`,
    'SETTING_ERROR_TITLE': 'Error!',
    'SETTING_ERROR_NOTPERMISSION': '⚠️ **BOT authority is insufficient!**\nRequired Permissions: `View Channels` `Send Messages` `Embed links`',
    'SETTING_ERROR_CHANNELNOTFOUND': (name) => `⚠️ There is no channel named ${discord.Formatters.inlineCode(name)}!`,

    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - Setting`,
    'SETTING_HOME_DESCRIPTION': (username) => `Welcome to ${username} control panel!\nHere you can change the settings for this BOT!\n\`\`\`\nSelect the settings you want to view or change from the select menu!\n\`\`\``,

    'SETTING_WELCOMEMESSAGE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 Setting - Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```This function notifies you when a new member joins or leaves the server. You can set up a message to send information that you want the person who joined to see.\n```\n**【Current settings】**',
    'SETTING_WELCOMEMESSAGE_FIELD_1': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_FIELD_2': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_FIELD_3': 'Custom Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_TITLE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_LABEL': 'channel name of destination',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_TITLE': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_LABEL': 'channel name of destination',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_TITLE': 'Custom Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_LABEL': 'custom welcome message',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_PLACEHOLDER': 'Tip: Mention can be made by typing <#channelId>, <@userId> and <@&roleID>.',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_1': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_1': 'Send a message when a member joins',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_2': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_2': 'Send a message when a member leaves',

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