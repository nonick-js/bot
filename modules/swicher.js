const discord = require('discord.js');

// settingコマンド専用
function statusSwicher(key) {
    return key ? `${discord.Formatters.formatEmoji('758380151544217670')} 有効` : `${discord.Formatters.formatEmoji('758380151238033419')} 無効`;
}

function chStatusSwicher(key, key2) {
    return key ? `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<#${key2}>)` : `${discord.Formatters.formatEmoji('758380151238033419')} 無効`;
}

function roleStatusSwicher(key, key2) {
    return key ? `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<@&${key2}>)` : `${discord.Formatters.formatEmoji('758380151238033419')} 無効`;
}

function buttonLabelSwicher(key) {
    return key ? '無効化' : '有効化';
}

function buttonStyleSwicher(key) {
    return key ? 'DANGER' : 'SUCCESS';
}

function buttonDisableSwicher(key) {
    return key ? false : true;
}

module.exports = { buttonDisableSwicher, buttonStyleSwicher, buttonLabelSwicher, roleStatusSwicher, chStatusSwicher, statusSwicher };