// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-addRole',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        /** @type {discord.Embed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const selectMenu = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const label = interaction.fields.getTextInputValue('textinput');
        const description = interaction.fields.getTextInputValue('textinput2') || undefined;
        const emoji = interaction.guild.emojis.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput3')) || undefined;
        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));

        if (!role) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ その名前のロールは存在しません！')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (selectMenu.components[0].type == discord.ComponentType.Button) {
            const select = new discord.ActionRowBuilder().addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('reactionRole')
                    .setMinValues(0)
                    .addOptions({ label: label, description: description, value: role.id, emoji: emoji?.id }),
            );
            interaction.update({ embeds: [embed], components: [select, selectMenu] });
        } else {
            if (selectMenu.components[0].options.find((v) => v.value == role.id)) {
                const error = new discord.EmbedBuilder()
                    .setDescription('❌ そのロールはすでにパネルに追加されています！')
                    .setColor('Red');
                return interaction.update({ embeds: [embed, error] });
            }
            selectMenu.components[0] = discord.SelectMenuBuilder.from(selectMenu.components[0]).addOptions({ label: label, description: description, value: role.id, emoji: emoji?.id });
            interaction.update({ embeds: [embed], components: [selectMenu, button ] });
        }
    },
};
module.exports = [ ping_command ];