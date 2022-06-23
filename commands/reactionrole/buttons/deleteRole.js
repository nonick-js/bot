const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ButtonInteraction} interaction
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
    data: { customid: 'reactionRole-DeleteRole', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const component = interaction.message.components[0].components[0];

        if (component.type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription('❌ まだ1つもロールを追加していません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }
        if (component.type == 'SELECT_MENU' && component.options.length == 1) {
            const error = new discord.MessageEmbed()
                .setDescription('❌ パネルには最低でも**1つ**ロールを追加する必要があります!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        const modal = new discord.Modal()
            .setCustomId('deleteRole')
            .setTitle('ロール削除')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel('セレクトメニューから削除したいロールの名前')
                        .setMaxLength(100)
                        .setRequired(true)
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};