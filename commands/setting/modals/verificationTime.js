// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/switcher');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-verificationTime',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const button = interaction.message.components[1];

        const oldModel = await require('../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        try {
            if (isNaN(Number(value)) || Number(value) < -1 || Number(value) > 23) throw '無効な値です！';
            if (customId == 'startChangeTime' && value == oldModel.get('endChangeTime')) throw '終了時刻と同じ時間に設定することはできません！';
            if (customId == 'endChangeTime' && value == oldModel.get('startChangeTime')) throw '開始時刻と同じ時間に設定することはできません！';
        }
        catch (err) {
            const errorEmbed = new discord.EmbedBuilder()
                .setDescription(`❌ ${err}`)
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], errorEmbed] });
        }

        let err = false;
        oldModel.update({ [customId]: Number(value) }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        const newModel = await require('../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const { startChangeTime, endChangeTime, newLevel } = newModel.get();

        const time = (startChangeTime !== null ? `**${startChangeTime}:00**` : '未設定') + ' ～ ' + (endChangeTime !== null ? `**${endChangeTime}:00**` : '未設定');
        interaction.message.embeds[0].fields[1].value = time;

        button.components[1] = discord.ButtonBuilder.from(button.components[1])
            .setDisabled(settingSwitcher('BUTTON_DISABLE', newLevel && startChangeTime && endChangeTime));

        interaction.update({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0], interaction.message.components[1]] });
    },
};
module.exports = [ ping_command ];