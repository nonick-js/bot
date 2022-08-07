// settingコマンド専用
function statusSwicher(languageData, key) {
    return key ? `${languageData('Setting.Common.Embed.Enable')}` : `${languageData('Setting.Common.Embed.Disable')}`;
}

function chStatusSwicher(languageData, key, key2) {
    return key ? `${languageData('Setting.Common.Embed.Ch_Enable', key2)}` : `${languageData('Setting.Common.Embed.Disable')}`;
}

function roleStatusSwicher(languageData, key, key2) {
    return key ? `${languageData('Setting.Common.Embed.Role_Enable', key2)}` : `${languageData('Setting.Common.Embed.Disable')}`;
}

function buttonLabelSwicher(languageData, key) {
    return key ? languageData('Setting.Common.Button.Disable') : languageData('Setting.Common.Button.Enable');
}

function buttonStyleSwicher(key) {
    return key ? 'DANGER' : 'SUCCESS';
}

function buttonDisableSwicher(key) {
    return key ? false : true;
}

module.exports = { buttonDisableSwicher, buttonStyleSwicher, buttonLabelSwicher, roleStatusSwicher, chStatusSwicher, statusSwicher };