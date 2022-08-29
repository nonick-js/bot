// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-update',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description') || null;
        const imageURL = interaction.fields.getTextInputValue('image') || null;

        const embed = new discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('516ff5')
            .setFooter(interaction.message.embeds[0].footer);
        if (imageURL?.startsWith('http://') || imageURL?.startsWith('https://')) embed.setImage(imageURL);

        interaction.update({ embeds: [embed] });
    },
};
module.exports = [ ping_command ];