// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/switcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-messageExpansion',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const Model = await require('../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const linkOpen = Model.get('linkOpen');

        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        let err = false;
        Model.update({ linkOpen: linkOpen ? false : true }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[0].value = settingSwitcher('STATUS_ENABLE', !linkOpen);
        button.components[1] = discord.ButtonBuilder.from(button.components[1])
            .setLabel(settingSwitcher('BUTTON_LABEL', !linkOpen))
            .setStyle(settingSwitcher('BUTTON_STYLE', !linkOpen));

        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];