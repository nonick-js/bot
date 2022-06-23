const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
* @param {discord.Client} client
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'reactionRole-addRole', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const component = interaction.message.components[0];

        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));
        if (!role) {
            const error = new discord.MessageEmbed()
                .setDescription('❌ その名前のロールは存在しません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        let emoji = interaction.fields.getTextInputValue('textinput3');
        if (emoji) {
            emoji = interaction.guild.emojis.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput3'));
            if (!emoji) {
                const error = new discord.MessageEmbed()
                    .setDescription('❌ その名前の絵文字は存在しません!')
                    .setColor('RED');
                return interaction.update({ embeds: [embed, error] });
            }
        }

        if (component.components[0].type == 'BUTTON') {
            const select = new discord.MessageActionRow().addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('reactionRole')
                    .setMinValues(0)
                    .addOptions([{ label: interaction.fields.getTextInputValue('textinput1'), description: interaction.fields.getTextInputValue('textinput2'), value: role.id, emoji: emoji.id }]),
            );
            interaction.update({ embeds: [embed], components: [select, component] });
        } else {
            if (component.components[0].options.find((v) => v.value == role.id)) {
                const error = new discord.MessageEmbed()
                    .setDescription('❌ そのロールはすでにパネルに追加されています!')
                    .setColor('RED');
                return interaction.update({ embeds: [embed, error] });
            }

            const button = interaction.message.components[1];
            component.components[0]
                .addOptions({ label: interaction.fields.getTextInputValue('textinput1'), description: interaction.fields.getTextInputValue('textinput2'), value: role.id, emoji: `${emoji}` });
            interaction.update({ embeds: [embed], components: [component, button ] });
        }
    },
};