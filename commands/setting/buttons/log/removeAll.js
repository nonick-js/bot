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

        interaction.message.components[1].components[0].options.forEach(v => interaction.db_logConfig.update({ [v.value]: false }, { where: { serverId: interaction.guild.id } }));
        embed.fields[1].value = 'なし',

        interaction.update({ embeds: [embed] });
    },
};
module.exports = [ ping_command ];