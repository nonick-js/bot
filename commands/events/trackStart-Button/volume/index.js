const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
* @callback InteractionCallback
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
    data: { customid: 'music-volume', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { dj, djRole } = config.get();

        if (dj && !interaction.member.roles.cache.has(djRole) && !interaction.member.permissions.has('ADMINISTRATOR')) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_DJROLE', djRole))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const modal = new discord.Modal()
            .setCustomId('setvolume')
            .setTitle(language('MUSIC_VOLUME_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel(language('MUSIC_VOLUME_MODAL_LABEL', queue.volume))
                        .setMaxLength(3)
                        .setPlaceholder(language('MUSIC_VOLUME_MODAL_PLACEHOLDER'))
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};