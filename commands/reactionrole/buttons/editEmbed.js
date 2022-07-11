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
    data: { customid: 'reactionRole-EditEmbed', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = interaction.message.embeds[0];
        const modal = new discord.Modal()
            .setCustomId('reactionRole-update')
            .setTitle(language('REACTION_EDITEMBED_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('title')
                        .setLabel(language('REACTION_MODAL_LABEL_1'))
                        .setMaxLength(1000)
                        .setValue(`${embed.title}`)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('description')
                        .setLabel(language('REACTION_MODAL_LABEL_2'))
                        .setPlaceholder(language('REACTION_MODAL_PLACEHOLDER_2'))
                        .setMaxLength(4000)
                        .setValue(`${embed.description}`)
                        .setStyle('PARAGRAPH')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('image')
                        .setLabel(language('REACTION_MODAL_LABEL_3'))
                        .setPlaceholder(language('REACTION_MODAL_PLACEHOLDER_3'))
                        .setMaxLength(500)
                        .setValue(embed.image ? embed.image.url : language('NULL'))
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};