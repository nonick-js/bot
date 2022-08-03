const discord = require('discord.js');
const languageData = {
    'BLACKLIST_MESSAGE': (username) => [`🚫 The use of **${username}** on this server is prohibited by the developer.`, 'Please contact `nonick-mc#1017` for more information and the reason for the ban.'].join('\n'),
    'NULL': 'none',

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
    'SETTING_WHATSNEW_ERROR': '⚠️ Failed to acquire data.\nPlease wait a while and try again.',

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
    'REPORT_MEMBER_UNDEFINED': '❌ The user has been removed!',
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

    'REPORT_USER_EMBED_TITLE': '⚠️ Report Member',
    'REPORT_USER_EMBED_DESCRIPTION': 'May I report this member?```The report will only be sent to the management of this server and not to Discord.```',
    'REPORT_USER_EMBED_FIELD_1': 'Target',
    'REPORT_USER_MODAL_TITLE': 'Report this Member',
    'REPORT_USER_SLAVE_EMBED_TITLE': '⚠️ Report (Member)',
    'REPORT_USER_SLAVE_EMBED_FOOTER': (tag) => `Reporter: ${tag}`,

    // UserInfo context menu
    'USERINFO_NONE': '__none__',
    'USERINFO_NICKNAME': (name) => `${discord.Formatters.formatEmoji('973880625566212126')} Nickname: **${name}**`,
    'USERINFO_USERID': (id) => `${discord.Formatters.formatEmoji('973880625641705522')} UserId: ${id}`,
    'USERINFO_CREATETIME': 'Account Create Date',
    'USERINFO_JOINTIME': 'Server Join Date',
    'USERINFO_ROLE': 'Roles',
    'USERINFO_BOOSTTIME': (time) => `Date of last boost: ${discord.Formatters.time(time, 'D')}`,

    // timeout command
    'TIMEOUT_PERMISSION_ERROR': '❌  **You are not authorized to do this!**\nRequired Permissions: `Timeout Members`',
    'TIMEOUT_REASON_NONE': 'No reason entered',
    'TIMEOUT_MEMBER_UNDEFINED': '❌ That user is not on this server!',
    'TIMEOUT_ROLE_ERROR': '❌ You cannot time out a member whose highest position is above or the same as yours!!',
    'TIMEOUT_MYSELF': 'I\'ll timeout you, shall I?',

    'TIMEOUT_RESULT': (array) => `⛔ ${array[0]} is timeout for **\`${array[1]}\`days\`${array[2]}\`minutes**.`,
    'TIMEOUT_ERROR': (id) => `❌ <@${id}> (\`${id}\`) timeout failed.\nYou have authority above the BOT or are an administrator of the server.`,
    'TIMEOUT_LOG_EMBED_TITLE': '⛔Timeout',
    'TIMEOUT_LOG_EMBED_FIELD_1': 'Punished Persons',
    'TIMEOUT_LOG_EMBED_FIELD_2': 'Time for timeout to be canceled',
    'TIMEOUT_LOG_EMBED_FIELD_3': 'Reason for timeout',
    'TIMEOUT_LOG_EMBED_FOOTER': (tag) => `by ${tag}`,
    'TIMEOUT_DM_EMBED_TITLE': '⛔Timeout',
    'TIMEOUT_DM_DESCRIPTION': (guild) => `You have been timed out of **${guild}**.`,
    'TIMEOUT_DM_EMBED_FIELD_1': 'Time for timeout to be canceled',
    'TIMEOUT_DM_EMBED_FIELD_2': 'Reason for timeout',
    'TIMEOUT_DM_SEND_ERROR': '⚠️ Warning DM to timed-out person failed. Message receipt rejected.',

    // Reaction command
    'REACTION_PERMISSION_ERROR': '❌ **You are not authorized to do this!**\nRequired Permissions: `Manage Roles`',
    'REACTION_ROLE_UNDEF': '❌ A role with that name does not exist!',
    'REACTION_EMOJI_UNDEF': '❌ There is no emoji with that name!',
    'REACTION_MODAL_TITLE': 'Raaction Role',
    'REACTION_MODAL_LABEL_1': 'Embed Title',
    'REACTION_MODAL_LABEL_2': 'Embed Description',
    'REACTION_MODAL_PLACEHOLDER_2': 'Let me explain this reaction role!',
    'REACTION_MODAL_LABEL_3': 'Image URL',
    'REACTION_MODAL_PLACEHOLDER_3': 'Only URLs beginning with http(s):// are supported.',
    'REACTION_BUTTON_2': 'Add',
    'REACTION_BUTTON_3': 'Remove',
    'REACTION_BUTTON_4_SINGLE': 'Single Select',
    'REACTION_BUTTON_4_MULTI': 'Multi Select',
    'REACTION_BUTTON_5': 'Send',
    'REACTION_BUTTON_6': 'Edit',
    'REACTION_CONTENT': '**Preview Mode**\nPress the "Send" button to send the panel to this channel.',
    'REACTION_CONTENT_EDIT': '**Preview Mode**\nPress the "Edit" button to finish editing the panel.',
    'REACTION_SUCCESS': '✅ Updated Roles!',
    'REACTION_ERROR': `${discord.Formatters.formatEmoji('968351750434193408')} Some roles could not be granted, please contact the BOT administrator.`,
    'REACTION_ERROR_ADMIM': (name) => `${discord.Formatters.formatEmoji('968351750434193408')} Some roles could not be granted. Please check the following\n・Has ${name} been granted \`Manage Roles\` permission?\n・Is there a position that ${name} has above the position on the panel?\n・Is the role present?`,
    'REACTION_ADDROLE_ERROR': '❌ No more roles can be added!',
    'REACTION_ADDROLE_MODAL_TITLE': 'Add Role',
    'REACTION_ADDROLE_MODAL_LABEL_1': 'Role Name',
    'REACTION_ADDROLE_MODAL_LABEL_2': 'Display Name',
    'REACTION_ADDROLE_MODAL_LABEL_3': 'Description',
    'REACTION_ADDROLE_MODAL_LABEL_4': 'Custom Emoji',
    'REACTION_ADDROLE_MODAL_PLACEHOLDER_4': 'Please enter with a emoji name',
    'REACTION_DELETEROLE_ERROR': '❌ Not a single role has been added yet!',
    'REACTION_DELETEROLE_ROLE_NOTINCLUDE': '❌ This role has not been added to the panel!',
    'REACTION_DELETEROLE_MODAL_TITLE': 'Remove Role',
    'REACTION_DELETEROLE_MODAL_LABEL': 'Role Name',
    'REACTION_EDITEMBED_MODAL_TITLE': 'Edit Embed',
    'REACTION_MODE_ERROR': '❌ Please add your role first!',
    'REACTION_SEND_SUCCESS': '✅ Panels have been created!',
    'REACTION_SEND_ERROR': '❌ You are not authorized to transmit on this channel!',
    'REACTION_EDIT_SEND': '✅ A new panel has been sent because the original panel does not exist!',
    'REACTION_EDIT_SUCCESS': '✅ Panel edited!',

    'EDITPANEL_NOTPANEL': '❌ It is not a reaction roll panel!',
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