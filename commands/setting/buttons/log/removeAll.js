// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-logEvents-removeAll',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const button = interaction.message.components[2];
        const events = interaction.message.components[1].components[0].options;

        const Model = require('../../../../models/log')(interaction.sequelize);
        let err = false;

        Model.update(Object.assign({}, ...events.map(v => ({ [v.value]: false }))), { where: { serverId: interaction.guildId } }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            interaction.update({ embeds: [embed, error] });
        }

        embed.fields[1].value = 'なし',
        button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(true);

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], interaction.message.components[1], button] });
    },
};
module.exports = [ ping_command ];