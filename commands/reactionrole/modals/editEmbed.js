// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-editEmbedModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setTitle(title)
            .setDescription(description || null);

        interaction.update({ embeds: [embed] });
    },
};
module.exports = [ ping_command ];