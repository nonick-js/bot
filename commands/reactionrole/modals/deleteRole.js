// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-deleteRoleModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));

        try {
            if (!role) throw 'その名前のロールは存在しません！';
        } catch (err) {
            const errorEmbed = new discord.EmbedBuilder()
                .setDescription(`❌ ${err}`)
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], errorEmbed] });
        }

        select.components[0] = discord.SelectMenuBuilder.from(select.components[0])
            .setOptions(select.components[0].options.filter(v => v.value !== role.id));
        interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
    },
};
module.exports = [ ping_command ];