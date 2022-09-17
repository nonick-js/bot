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
        const button = interaction.message.components[2];

        const values = interaction.values;
        const categoryData = [
            { key: 'bot', value: `${interaction.client.user.username}` },
            { key: 'timeout', value: 'タイムアウト' },
            { key: 'kick', value: 'Kick' },
            { key: 'ban', value: 'BAN' },
        ];

        const enableCategory = categoryData.filter(v => values.includes(v.key));
        const disableCategory = categoryData.filter(v => !values.includes(v.key));

        const Model = await require('../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        let err = false;

        Model.update(Object.assign({}, ...enableCategory.map(v => ({ [v.key]: true })))).catch(() => err = true);
        Model.update(Object.assign({}, ...disableCategory.map(v => ({ [v.key]: false })))).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 一部設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[1].value = enableCategory.map(v => `\`${v.value}\``).join(' ') || 'なし';
        button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(embed.fields[1].value == 'なし' ? true : false);

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], interaction.message.components[1], interaction.message.components[2]] });
    },
};
module.exports = [ ping_command ];