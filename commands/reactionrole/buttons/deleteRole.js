const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client}
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
    exec: async (client, interaction) => {
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        if (select.components[0].type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription('❌ まだ1つもロールを追加していません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (select.components[0].options.length == 1) return interaction.update({ embeds: [embed], components: [button] });

        const modal = new discord.Modal()
            .setCustomId('deleteRole')
            .setTitle('ロール削除')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel('ロールの名前')
                        .setMaxLength(100)
                        .setRequired(true)
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};