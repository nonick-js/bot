// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-verificationTime',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;

        try {
            if (isNaN(Number(value)) || Number(value) < -1 || Number(value) > 23) throw '無効な値です！';

            interaction.db_verificationConfig.update({ [customId]: Number(value) }, { where: { serverId: interaction.guildId } });
            const verificationConfig = await interaction.db_verificationConfig.findOne({ where: { serverId: interaction.guildId } });
            const { startChangeTime, endChangeTime } = verificationConfig.get();

            const time = (startChangeTime !== null ? `${startChangeTime}:00` : '未設定') + ' ～ ' + (endChangeTime !== null ? `${endChangeTime}:00` : '未設定');
            interaction.message.embeds[0].fields[1].value = time;

            interaction.update({ embeds: [interaction.message.embeds[0]] });
        }
        catch (err) {
            const errorEmbed = new discord.EmbedBuilder()
                .setDescription(`❌ ${err}`)
                .setColor('Red');
            interaction.update({ embeds: [interaction.message.embeds[0], errorEmbed] });
        }
    },
};
module.exports = [ ping_command ];