// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-basicModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const title = interaction.fields.getTextInputValue('title');
        const url = interaction.fields.getTextInputValue('url');
        const description = interaction.fields.getTextInputValue('description');
        const color = interaction.fields.getTextInputValue('color')?.match(new RegExp(/^#[0-9A-Fa-f]{6}$/, 'g'));

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setTitle(title)
            .setURL(urlCheck(url))
            .setDescription(description || null)
            .setColor(color?.[0] || interaction.message.embeds[0].hexColor);

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

        function urlCheck(param) {
            if (!param) return null;
            else if (param.startsWith('https://') || param.startsWith('http://')) return param;
            else return interaction.message.embeds[0][Object.keys({ param })[0]];
        }
    },
};
module.exports = [ ping_command ];