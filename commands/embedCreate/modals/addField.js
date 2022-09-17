// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-addFieldModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const name = interaction.fields.getTextInputValue('name');
        const value = interaction.fields.getTextInputValue('value');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .addFields({ name: name, value: value });

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));
    },
};
module.exports = [ ping_command ];