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
        const color = interaction.fields.getTextInputValue('color')?.match(new RegExp(/^#[0-9A-Fa-f]{6}$/, 'g'));
        const image = interaction.fields.getTextInputValue('image');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setTitle(title)
            .setDescription(description || null)
            .setColor(color?.[0] || interaction.message.embeds[0].hexColor)
            .setImage(urlCheck(image));

        interaction.update({ embeds: [embed] });

        function urlCheck(param) {
            if (!param) return null;
            else if (param.startsWith('https://') || param.startsWith('http://')) return param;
            else return interaction.message.embeds[0][Object.keys({ param })[0]];
        }
    },
};
module.exports = [ ping_command ];