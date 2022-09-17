// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-deleteRole',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));
        const replace = select.components[0].options.findIndex((v) => v.value == role.id);

        try {
            if (!role) throw 'その名前のロールは存在しません！';
            if (replace == 1) throw 'このロールはパネルに追加されていません！';
        } catch (err) {
            const errorEmbed = new discord.EmbedBuilder()
                .setDescription(`❌ ${err}`)
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], errorEmbed] });
        }

        select.components[0] = discord.SelectMenuBuilder.from(select.components[0])
            .setOptions(select.components[0].options.splice(replace - 1, 1));
        interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
    },
};
module.exports = [ ping_command ];