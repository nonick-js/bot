// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole-addRoleModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        /** @type {discord.ActionRow} */
        const component = interaction.message.components[0];

        const regexp = new RegExp(/\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu);

        const displayName = interaction.fields.getTextInputValue('textinput1');
        const description = interaction.fields.getTextInputValue('textinput2');
        const unicodeEmoji = interaction.fields.getTextInputValue('textinput3').match(regexp);
        const emoji = interaction.guild.emojis.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput3'));
        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));

        try {
            if (!role) throw 'その名前のロールは存在しません！';
            if (role.managed) throw 'そのロールは外部サービスによって管理されているため追加できません！';
        } catch (err) {
            const error = new discord.EmbedBuilder()
                .setDescription(`❌ ${err}`)
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        if (!role) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ その名前のロールは存在しません！')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], error] });
        }

        if (component.components[0].type == discord.ComponentType.Button) {
            const select = new discord.ActionRowBuilder().addComponents(
                new discord.SelectMenuBuilder()
                    .setCustomId('reactionRole')
                    .setMinValues(0)
                    .setOptions({ label: displayName || role?.name, description: description || undefined, value: role.id, emoji: unicodeEmoji?.[0] ?? emoji?.id }),
            );
            interaction.update({ components: [select, component] });
        } else {
            if (component.components[0].options.find((v) => v.value == role.id)) {
                const embed = new discord.EmbedBuilder()
                    .setDescription('❌ そのロールはすでにパネルに追加されています！')
                    .setColor('Red');
                return interaction.update({ embeds: [interaction.message.embeds[0], embed] });
            }
            component.components[0] = discord.SelectMenuBuilder.from(component.components[0])
                .addOptions({ label: displayName || role.name, description: description || undefined, value: role.id, emoji: unicodeEmoji?.[0] ?? emoji?.id });
            interaction.update({ embeds: [interaction.message.embeds[0]], components: [component, interaction.message.components[1] ] });
        }
    },
};
module.exports = [ ping_command ];