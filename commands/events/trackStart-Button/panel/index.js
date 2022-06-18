const discord = require('discord.js');

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
    data: { customid: 'music-panel', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('music-10secAgo')
                .setEmoji('⏪')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('music-10secSkip')
                .setEmoji('⏩')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('music-loop')
                .setEmoji('🔂')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('music-loop-all')
                .setEmoji('🔁')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('music-shuffle')
                .setEmoji('🔀')
                .setStyle('SECONDARY'),
        );
        const button2 = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('none1')
                .setLabel('ㅤ')
                .setStyle('SECONDARY')
                .setDisabled(true),
            new discord.MessageButton()
                .setCustomId('none2')
                .setLabel('ㅤ')
                .setStyle('SECONDARY')
                .setDisabled(true),
            new discord.MessageButton()
                .setCustomId('none3')
                .setLabel('ㅤ')
                .setStyle('SECONDARY')
                .setDisabled(true),
            new discord.MessageButton()
                .setCustomId('music-queue')
                .setEmoji('📄')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('music-stop')
                .setEmoji('⏹️')
                .setStyle('DANGER'),
        );
        interaction.reply({ components: [button, button2], ephemeral: true });
    },
};