// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'deleteRole',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        /** @type {discord.Embed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));
        if (!role) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ その名前のロールは存在しません!')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        const replace = select.components[0].options.findIndex((v) => v.value == role.id);
        if (replace == -1) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ このロールはパネルに追加されていません!')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        select.components[0] = discord.SelectMenuBuilder.from(select.components[0]).setOptions(select.components[0].options.splice(replace - 1, 1));
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];