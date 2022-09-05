const welcomeMSyntax = [
    /!\[serverName\]/g,
    /!\[memberCount\]/g,
    /!\[user\]/g,
    /!\[userName\]/g,
    /!\[userTag\]/g,
];

function welcomeM_preview(message) {
    let result = message;

    const replace = [
        '`![serverName]`',
        '`![memberCount]`',
        '`![user]`',
        '`![userName]`',
        '`![userTag]`',
    ];

    for (let i = 0; i < welcomeMSyntax.length; i++) result = result.replace(welcomeMSyntax[i], replace[i]);
    return result;
}

function welcomeM(message, param) {
    let result = message;

    const replace = [
        param.guild.name,
        param.guild.memberCount,
        param.user,
        param.user.username,
        param.user.tag,
    ];

    for (let i = 0; i < welcomeMSyntax.length; i++) result = result.replace(welcomeMSyntax[i], replace[i]);
    return result;
}

module.exports = { welcomeM_preview, welcomeM };