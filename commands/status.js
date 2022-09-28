// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const emojies = {
    warning: discord.formatEmoji('1021382599467352114'),
    danger: discord.formatEmoji('1021382597785423892'),
    beta: discord.formatEmoji('1021382601031823371') + discord.formatEmoji('1021383211147870280'),
};

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'status',
        description: 'このBOTのステータスを表示します',
        dmPermission: true,
        type: 'CHAT_INPUT',
    },
    exec: async (interaction) => {
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const embed = new discord.EmbedBuilder()
            .setTitle(`${interaction.client.user.username} のステータス`)
            .setColor('Green')
            .setFields(
                { name: '💾メモリ使用量', value: `${ram > 500 ? `${emojies.warning} \`${ram}\`MB` : `\`${ram}\`MB` }`, inline: true },
                { name: '🌐Ping', value: `\`${interaction.client.ws.ping}\`ms`, inline: true },
                { name: '💽Discord.js', value: `\`v${discord.version}\``, inline: true },
                { name: '💻プラットフォーム', value: `\`${process.platform}\``, inline: true },
                { name: '📡導入数', value: `\`${interaction.client.guilds.cache.size}\`サーバー`, inline: true },
                { name: '👥総メンバー数', value: `\`${interaction.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\` 人`, inline: true },
            );
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
module.exports = [ ping_command ];