// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../../modules/switcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-log',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const Model = await require('../../../../models/log')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const { log, logCh } = Model.get();

        const embed = interaction.message.embeds[0];
        const button = interaction.message.components[1];

        let err = false;

        Model.update({ log: log ? false : true }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[0].value = settingSwitcher('STATUS_CH', !log, logCh);
        button.components[1] = discord.ButtonBuilder.from(button.components[1])
            .setLabel(settingSwitcher('BUTTON_LABEL', !log))
            .setStyle(settingSwitcher('BUTTON_STYLE', !log)),

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
    },
};
module.exports = [ ping_command ];