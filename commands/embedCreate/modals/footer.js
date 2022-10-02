// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-footerModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const text = interaction.fields.getTextInputValue('text');
        const iconURL = interaction.fields.getTextInputValue('iconURL');

        const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
            .setFooter({
                text: text || null,
                iconURL: urlCheck(iconURL),
            });

        interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

        function urlCheck(param) {
            if (!param) return null;
            else if (param.startsWith('https://') || param.startsWith('http://')) return param;
            else return interaction.message.embeds[0]?.footer?.[Object.keys({ param })[0]];
        }
    },
};
module.exports = [ ping_command ];