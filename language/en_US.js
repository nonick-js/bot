const discord = require('discord.js');
const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 The use of **${username}** on this server is prohibited by the developer.`, 'Please contact `nonick-mc#1017` for more information and the reason for the ban.'].join('\n'),

    // info command
    'INFO_DESCRIPTION': '**“Easy to use” is the motto of Completely free multifunctional BOT!**\nWe are developing a BOT that anyone can use easily!\n\n🔹**Features**\n`WelcomeMessage` `ReportContextMenu` `ReactionRole` `MusicPlayback` `/timeout` `/ban`',
    'INFO_FOOTER_TEXT': 'Developer・nonick-mc#1017',
    'INFO_BUTTON_LABEL': 'Support Server',

    // setting command
    'SETTING_PERMISSION_ERROR': '❌ **You are not authorized to do this!**\nRequired Permissions: `Manage Server`',
    'SETTING_DISABLE': `${discord.Formatters.formatEmoji('758380151238033419')} Disable`,
    'SETTING_ENABLE': `${discord.Formatters.formatEmoji('758380151544217670')} Enable`,
    'SETTING_CHANNEL_ENABLE': (ch) => `${discord.Formatters.formatEmoji('758380151544217670')} Enable (<#${ch}>)`,
    'SETTING_ROLE_ENABLE': (role) => `${discord.Formatters.formatEmoji('758380151544217670')} Enable (<@&${role}>)`,
    'SETTING_BUTTON_ENABLE': 'Enable',
    'SETTING_BUTTON_DISABLE': 'Disable',
    'SETTING_BUTTON_CH': 'Channel',
    'SETTING_BUTTON_MESSAGE': 'Message',
    'SETTING_BUTTON_ROLE': 'Role',
    'SETTING_NONE': '__Not configured__',
    'SETTING_CH_SUCCESS_DESCRIPTION': (name) => `✅ **${name}** will be sent here!`,
    'SETTING_ERROR_TITLE': 'Error!',
    'SETTING_ERROR_NOTPERMISSION': '⚠️ **BOT authority is insufficient!**\nRequired Permissions: `View Channels` `Send Messages` `Embed links`',
    'SETTING_ERROR_CHANNELNOTFOUND': (name) => `⚠️ There is no channel named ${discord.Formatters.inlineCode(name)}!`,
    'SETTING_ERROR_ROLENOTFOUND': (name) => `⚠️ There is no role named ${discord.Formatters.inlineCode(name)}!`,
    'SETTING_HOME_TITLE': (username) => `🛠 ${username} - Setting`,
    'SETTING_HOME_DESCRIPTION': (username) => `Welcome to ${username} control panel!\nHere you can change the settings for this BOT!\n\`\`\`Select the settings you want to view or change from the select menu!\`\`\``,

    'SETTING_WELCOMEMESSAGE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_TITLE': '🛠 Setting - Welcome Message',
    'SETTING_WELCOMEMESSAGE_EMBED_DESCRIPTION': '```This function notifies you when a new member joins or leaves the server. You can set up a message to send information that you want the person who joined to see.```\n**【Current settings】**',
    'SETTING_WELCOMEMESSAGE_FIELD_1': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_FIELD_2': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_FIELD_3': 'Custom Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_TITLE': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOME_MODAL_LABEL': 'channel name of destination',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_TITLE': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_LEAVE_MODAL_LABEL': 'channel name',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_TITLE': 'Custom Welcome Message',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_LABEL': 'Custom welcome message',
    'SETTING_WELCOMEMESSAGE_WELCOMEMESSAGE_MODAL_PLACEHOLDER': 'Tip: Mention can be made by typing <#channelId>, <@userId> and <@&roleID>.',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_1': 'Welcome Message',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_1': 'Send a message when a member joins',
    'SETTING_WELCOMEMESSAGE_SELECT_TITLE_2': 'Leave Message',
    'SETTING_WELCOMEMESSAGE_SELECT_DESCRIPTION_2': 'Send a message when a member leaves',

    'SETTING_REPORT': 'Report Cotextmenu',
    'SETTING_REPORT_EMBED_TITLE': '🛠 Setting - Report Contextmenu',
    'SETTING_REPORT_EMBED_DESCRIPTION': '**Tips**: If you want to turn off the functionality of the context menu itself, you can change it from `Server Settings → Linked Services → NoNICK.js`.```This function allows members to report messages that violate server rules, etc. This reduces the burden on management by eliminating the need for moderators to monitor messages.```\n**【Current settings】**',
    'SETTING_REPORT_EMBED_FIELD_1': 'Report Receive Channel',
    'SETTING_REPORT_EMBED_FIELD_2': 'Role Mention',
    'SETTING_REPORT_SELECT_TITLE_1': 'General setting',
    'SETTING_REPORT_SELECT_TITLE_2': 'Role Mention',
    'SETTING_REPORT_SELECT_DESCRIPTION_2': 'Mention role upon receipt of report',
    'SETTING_REPORT_REPORTCH_MODAL_TITLE': 'Report Receive Channel',
    'SETTING_REPORT_REPORTCH_MODAL_LABEL': 'channel name',
    'SETTING_REPORT_REPORTROLE_MODAL_TITLE': 'Role Mention',
    'SETTING_REPORT_REPORTROLE_MODAL_LABEL': 'role name',

    'SETTING_MESSAGELINKEXPANSION': 'Message Link Expansion',
    'SETTING_MESSAGELINKEXPANSION_EMBED_TITLE': '🛠 Setting - Message Link Expansion',
    'SETTING_MESSAGELINKEXPANSION_EMBED_DESCRIPTION': '```This function displays the linked message when you send a Discord message link.\nThis is useful when you want to chat about past messages.```\n**【Current settings】**',
    'SETTING_MESSAGELINKEXPANSION_EMBED_FIELD_1': 'Message Link Expansion',
    'SETTING_MESSAGELINKEXPANSION_SELECT_TITLE_1': 'General Setting',

    'SETTING_MUSIC': 'MusicPlayback',
    'SETTING_MUSIC_EMBED_TITLE': '🛠 Setting - MusicPlayback',
    'SETTING_MUSIC_EMBED_DESCRIPTION': '**Tips**: If you want to turn off the functionality of the slash command itself, you can change it from `Server Settings → Linked Services → NoNICK.js`.\n```Music from Youtube, Spotify, and SoundCloud can be played in Voice Chat. This is useful when you want to play music within a Voice Chat.```\n**【Current setting】**',
    'SETTING_MUSIC_EMBED_FIELD_1': 'DJ Mode',
    'SETTING_MUSIC_EMBED_FIELD_2': '❓What is DJ Mode?',
    'SETTING_MUSIC_EMBED_FIELD_2_VALUE': 'Only members with the specified role and administrative privileges are allowed to use the music command and playback panel.\nFor use on large servers or to prevent Voice Chat vandalism, it is **recommended to enable this setting. **',
    'SETTING_MUSIC_SELECT_TITLE_1': 'DJ Mode',
    'SETTING_MUSIC_DJROLE_MODAL_TITLE': 'DJ Mode',
    'SETTING_MUSIC_DJROLE_MODAL_LABEL': 'role name',
    'SETTING_LANGUAGE_TITLE': '🌐 Language Setting',
    'SETTING_LANGUAGE_DESCRIPTION': 'Please select the language you wish to use.',

    // ConnectionError
    'CONNECTIONERROR_EMBED_TITLE': 'Error!',

    // GuildMemberAdd
    'GUILDMEMBERADD_BOT_TITLE': (name) => `${name} has been introduced!`,
    'GUILDMEMBERADD_MEMBER_DESCRIPTION': (array) => `${array[0]}**(${array[1]})**\nWelcome to **${array[2]}**!\n${array[3]}\n\n**${array[4]}** Members`,

    // GuidlMemberRemove
    'GUILDMEMBERREMOVE_BOT_TITLE': (name) => `${name} is abolished`,
    'GUILDMEMBERREMOVE_MEMBER': (name) => `**${name}** has left the server👋`,

    // TrackStart
    'TRACKSTART_PLAYING': 'Now Playing',

    // MessageCreate
    'MESSAGECREATE_MESSAGELINKEXPANSION_CONTENTEMBED_TITLE': 'Message Link Expansion',
    'MESSAGECREATE_MESSAGELINKEXPANSION_CONTENTEMBED_FIELD': 'Message Content',
    'MESSAGECREATE_MESSAGELINKEXPANSION_ERROR_TITLE': 'Error!',

    // Report Context Menu
    'REPORT_NOT_SETTING': '⚠️ **Additional configuration is required to use this feature.**\nPlease contact the person who has the authority to set up the BOT.',
    'REPORT_NOT_SETTING_ADMIN': '⚠️ **Additional configuration is required to use this feature.**\nOpen the settings for the reporting function in `/setting` and set the channel to receive the calls.',
    'REPORT_NOT_SETTING_ADMIN_IMAGE': 'https://media.discordapp.net/attachments/958791423161954445/995556431661109358/unknown.png',
    'REPORT_MEMBER_UNDEFINED': '❌ That user is not on this server!',
    'REPORT_MYSELF': 'There\'s no point in reporting me.',
    'REPORT_BOT': '❌ You cannot report BOTs, Webhooks, or System messages!',
    'REPORT_YOURSELF': 'You are reporting yourself...',
    'REPORT_ADMIN': '❌ You cannot report the server operator with this command!',
    'REPORT_SUCCESS': '✅ **Thanks for the report! ** Report sent to server management!',
    'REPORT_ERROR': '❌ A problem occurred while submitting a report.',
    'REPORT_BUTTON_LABEL': 'Report',
    'REPORT_MODAL_LABEL': 'Report Reason',
    'REPORT_MODAL_PLACEHOLDER': 'Please be as detailed as possible',

    'REPORT_MESSAGE_EMBED_TITLE': '⚠️ Report Message',
    'REPORT_MESSAGE_EMBED_DESCRIPTION': 'May I report this message?```The report will only be sent to the management of this server and not to Discord.```',
    'REPORT_MESSAGE_EMBED_FIELD_1': 'Author',
    'REPORT_MESSAGE_EMBED_FIELD_2': 'Post Channel',
    'REPORT_MESSAGE_EMBED_FIELD_2_VALUE': (array) => `${array[0]} [Link](${array[1]})`,
    'REPORT_MESSAGE_EMBED_FIELD_3': 'Message',
    'REPORT_MESSAGE_MODAL_TITLE': 'Report this message',
    'REPORT_MESSAGE_SLAVE_EMBED_TITLE': '⚠️ Report (Message)',
    'REPORT_MESSAGE_SLAVE_EMBED_FOOTER': (tag) => `Reporter: ${tag}`,

    'REPORT_USER_EMBED_TITLE': '⚠️ Report User',
    'REPORT_USER_EMBED_DESCRIPTION': 'May I report this user?```The report will only be sent to the management of this server and not to Discord.```',
    'REPORT_USER_EMBED_FIELD_1': 'Target',
    'REPORT_USER_MODAL_TITLE': 'Report this User',
    'REPORT_USER_SLAVE_EMBED_TITLE': '⚠️ Report (User)',
    'REPORT_USER_SLAVE_EMBED_FOOTER': (tag) => `Reporter: ${tag}`,
};

const translate = (key, args) => {
    const translation = languageData[key];
    if (!translation) {
        const JPLanguage = require('./ja_JP');
        return JPLanguage(key, args);
    }
    if (typeof translation === 'function') return translation(args);
    else return translation;
};

module.exports = translate;