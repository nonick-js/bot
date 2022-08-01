const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
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
    data: { name: 'パネルの編集', type: 'MESSAGE' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

        const message = interaction.targetMessage;

        if (message.author.id !== client.user.id || !message.embeds[0] || !message.components[0]) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('EDITPANEL_NOTPANEL'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const components = message.components[0].components[0];
        const panelEmbed = message.embeds[0];
        panelEmbed.setAuthor({
            name: `${message.id}`,
            iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png',
        });

        if (components.type !== 'SELECT_MENU' || components.options[0].value.length !== 18) {
            const embed = new discord.MessageEmbed()
                .setDescription('EDITPANEL_NOTPANEL')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('REACTION_PERMISSION_ERROR'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
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
                .setCustomId('reactionRole-Edit')
                .setLabel(language('REACTION_BUTTON_6'))
                .setStyle('PRIMARY'),
        );

        interaction.reply({
            content: `${language('REACTION_CONTENT_EDIT')}`,
            embeds: [panelEmbed],
            components: [message.components[0], button],
            ephemeral: true,
        });
    },
};