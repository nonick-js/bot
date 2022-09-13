// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-imageModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const thumbnail = interaction.fields.getTextInputValue('thumbnail');
        const image = interaction.fields.getTextInputValue('image');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setThumbnail(urlCheck(thumbnail))
            .setImage(urlCheck(image));

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

        function urlCheck(param) {
            if (!param) return null;
            else if (param.startsWith('https://') || param.startsWith('http://')) return param;
            else return interaction.message.embeds[0][Object.keys({ param })[0]];
        }
    },
};
module.exports = [ ping_command ];