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
    exec: async (client, interaction) => {
        const embed = interaction.message.embeds[0];
        const modal = new discord.Modal()
            .setCustomId('reactionRole-update')
            .setTitle('埋め込みの編集')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('title')
                        .setLabel('タイトル')
                        .setMaxLength(1000)
                        .setValue(`${embed.title}`)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('description')
                        .setLabel('説明')
                        .setMaxLength(4000)
                        .setValue(`${embed.description}`)
                        .setStyle('PARAGRAPH')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('image')
                        .setLabel('画像URL')
                        .setPlaceholder('http(s):// から始まるURLのみ対応しています。')
                        .setMaxLength(500)
                        .setValue(embed.image ? embed.image.url : 'なし')
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};