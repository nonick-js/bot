const discord = require('discord.js');

// settingコマンド専用
/**
 * @callback switcher
 * @param {'STATUS_ENABLE'|'STATUS_CH'|'STATUS_ROLE'|'BUTTON_LABEL'|'BUTTON_STYLE'|'BUTTON_DISABLE'} type
 * @param {any} key
 * @param {any} key2
*/

/** @type {switcher} */
function settingSwitcher(type, key, key2) {
    switch (type) {
        case 'STATUS_ENABLE':
            return key ? `${discord.formatEmoji('758380151544217670')} **有効**` : `${discord.formatEmoji('1014606484849565797')} **無効**`;
        case 'STATUS_CH':
            return key ? `${discord.formatEmoji('758380151544217670')} **有効** : ${key2 ? `<#${key2}>` : `${discord.formatEmoji('966588719635267624')}未設定`}` : `${discord.formatEmoji('1014606484849565797')} **無効** : ${key2 ? `<#${key2}>` : `${discord.formatEmoji('966588719635267624')}未設定`}`;
        case 'STATUS_ROLE':
            return key ? `${discord.formatEmoji('758380151544217670')} **有効** : ${key2 ? `<@&${key2}>` : `${discord.formatEmoji('966588719635267624')}未設定`}` : `${discord.formatEmoji('1014606484849565797')} **無効** : ${key2 ? `<@&${key2}>` : `${discord.formatEmoji('966719258430160986')}未設定`}`;
        case 'BUTTON_LABEL':
            return key ? '無効化' : '有効化';
        case 'BUTTON_STYLE':
            return key ? discord.ButtonStyle.Danger : discord.ButtonStyle.Success;
        case 'BUTTON_DISABLE':
            return key ? false : true;
    }
}

module.exports = { settingSwitcher };