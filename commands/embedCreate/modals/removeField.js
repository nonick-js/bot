// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-removeFieldModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const name = interaction.fields.getTextInputValue('name');
        const fields = interaction.message.embeds[0].fields.filter(v => v.name !== name);

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setFields(fields);

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));
    },
};
module.exports = [ ping_command ];