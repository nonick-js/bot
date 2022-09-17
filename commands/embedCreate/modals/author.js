// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-authorModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const name = interaction.fields.getTextInputValue('name');
        const iconURL = interaction.fields.getTextInputValue('iconURL');
        const url = interaction.fields.getTextInputValue('url');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setAuthor({
                name: name || null,
                iconURL: urlCheck(iconURL),
                url: urlCheck(url),
            });

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

        function urlCheck(param) {
            if (!param) return null;
            else if (param.startsWith('https://') || param.startsWith('http://')) return param;
            else return interaction.message.embeds[0].author[Object.keys({ param })[0]];
        }
    },
};
module.exports = [ ping_command ];