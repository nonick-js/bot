const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.SelectMenuInteraction} interaction
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
    data: { customid: 'reactionRole', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        if (interaction.message.flags.has('EPHEMERAL')) return interaction.update({});

        await interaction.deferReply({ ephemeral: true });
        let errorCount = 0;
        for (let i = 0; i < interaction.component.options.length; i++) {
            await interaction.member.roles.remove(interaction.component.options[i].value).catch(() => {
                errorCount = 1;
            });
        }
        for (let i = 0; i < interaction.values.length; i++) {
            await interaction.member.roles.add(interaction.values[i]).catch(() => {
                errorCount = 1;
            });
        }

        if (errorCount == 1) {
            if (interaction.member.permissions.has('MANAGE_ROLES')) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('REACTION_ERROR_ADMIM', client.user.username))
                    .setColor('RED');
                interaction.editReply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('REACTION_ERROR'))
                    .setColor('RED');
                interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        } else {
            const embed = new discord.MessageEmbed()
                .setDescription(language('REACTION_SUCCESS'))
                .setColor('GREEN');
            interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};