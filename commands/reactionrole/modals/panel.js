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
    data: { customid: 'reactionRoleSetting', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const imageURL = interaction.fields.getTextInputValue('image');
        const embed = new discord.MessageEmbed()
            .setTitle(interaction.fields.getTextInputValue('title'))
            .setDescription(interaction.fields.getTextInputValue('description'))
            .setColor('516ff5');
        if (imageURL) {
            if (imageURL.startsWith('http://') || imageURL.startsWith('https://')) {
                embed.setImage(imageURL);
            }
        }

        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('reactionRole-EditEmbed')
                .setEmoji('988439788132646954')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-AddRole')
                .setLabel(language('REACTION_BUTTON_2'))
                .setEmoji('988439798324817930')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-DeleteRole')
                .setLabel(language('REACTION_BUTTON_3'))
                .setEmoji('989089271275204608')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-Mode')
                .setLabel(language('REACTION_BUTTON_4_SINGLE'))
                .setStyle('SUCCESS'),
            new discord.MessageButton()
                .setCustomId('reactionRole-Send')
                .setLabel(language('REACTION_BUTTON_5'))
                .setStyle('PRIMARY'),
        );
        interaction.reply({ content: `${language('REACTION_CONTENT')}`, embeds: [embed], components: [button], ephemeral: true });
    },
};