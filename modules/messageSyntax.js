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

function welcomeM(message, member) {
    let result = message;

    const replace = [
        member.guild.name,
        member.guild.memberCount,
        member.user,
        member.user.username,
        member.user.tag,
    ];

    for (let i = 0; i < welcomeMSyntax.length; i++) result = result.replace(welcomeMSyntax[i], replace[i]);
    return result;
}

module.exports = { welcomeM_preview, welcomeM };