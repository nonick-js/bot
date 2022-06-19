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
    exec: async (interaction, client, Configs, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);

        const modal = new discord.Modal()
            .setCustomId('setvolume')
            .setTitle('音量設定')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel(`現在の音量: ${queue.volume}`)
                        .setMaxLength(3)
                        .setPlaceholder('0~200までの値で指定してください。 ')
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};