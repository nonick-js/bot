// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-logEvents',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[1];

        const selectData = interaction.values;
        const categoryData = [
            { name: 'botLog', value: `\`${interaction.client.user.username}\`` },
            { name: 'messageDelete', value: ' `メッセージ削除` ' },
            { name: 'timeout', value: ' `タイムアウト` ' },
            { name: 'kick', value: ' `Kick` ' },
            { name: 'ban', value: ' `BAN` ' },
        ];

        selectData.forEach(v => interaction.db_logConfig.update({ [v]: true }, { where: { serverId: interaction.guild.id } }));
        categoryData.filter(v => !selectData.includes(v.name)).forEach(v => interaction.db_logConfig.update({ [v.name]: false }, { where: { serverId: interaction.guild.id } }));

        const status = categoryData.filter(v => selectData.includes(v.name)).map(v => v['value']);
        embed.fields[1].value = status.join(' ') || 'なし';

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], select, interaction.message.components[2]] });
    },
};
module.exports = [ ping_command ];