// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const fieldIndex = {
    welcomeMessage: 2,
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'modal-setting-welcomeMessage',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];

        interaction.db_config.update({ [setting]: `${textInput}` }, { where: { serverId: interaction.guildId } });
        embed.fields[fieldIndex[setting]].value = textInput;
        interaction.update({ embeds: [embed] });
    },
};
module.exports = [ ping_command ];