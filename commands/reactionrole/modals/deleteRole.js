const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
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
    data: { customid: 'deleteRole', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('textinput'));
        if (!role) {
            const error = new discord.MessageEmbed()
                .setDescription('❌ その名前のロールは存在しません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        const replace = select.components[0].options.findIndex((v) => v.value == role.id);
        if (replace == -1) {
            const error = new discord.MessageEmbed()
                .setDescription('❌ このロールはパネルに追加されていません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        select.components[0].spliceOptions(replace, 1);
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};