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
    data: { customid: 'reactionRole-AddRole', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0].components[0];

        if (select.type == 'SELECT_MENU' && select.options.length == 25) {
            const error = new discord.MessageEmbed()
                .setDescription(language('REACTION_ADDROLE_ERROR'))
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        const modal = new discord.Modal()
            .setCustomId('reactionRole-addRole')
            .setTitle(language('REACTION_ADDROLE_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel(language('REACTION_ADDROLE_MODAL_LABEL_1'))
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput1')
                        .setLabel(language('REACTION_ADDROLE_MODAL_LABEL_2'))
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput2')
                        .setLabel(language('REACTION_ADDROLE_MODAL_LABEL_3'))
                        .setStyle('SHORT')
                        .setMaxLength(100),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput3')
                        .setLabel(language('REACTION_ADDROLE_MODAL_LABEL_4'))
                        .setStyle('SHORT')
                        .setPlaceholder(language('REACTION_ADDROLE_MODAL_PLACEHOLDER_4'))
                        .setMaxLength(32),
                ),
            );
        interaction.showModal(modal);
    },
};