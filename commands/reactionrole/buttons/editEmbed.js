const discord = require('discord.js');

/**
* @callback InteractionCallback
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
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const modal = new discord.Modal()
            .setCustomId('reactionRole-update')
            .setTitle('パネルの編集')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('title')
                        .setLabel('埋め込みのタイトル')
                        .setMaxLength(1000)
                        .setValue(`${embed.title}`)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('description')
                        .setLabel('埋め込みの説明')
                        .setPlaceholder('このリアクションロールについて説明しよう')
                        .setMaxLength(4000)
                        .setValue(`${embed.description}`)
                        .setStyle('PARAGRAPH')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('image')
                        .setLabel('埋め込みに乗せる画像のURL')
                        .setPlaceholder('URLのみ対応しています。')
                        .setMaxLength(500)
                        .setValue(embed.image ? embed.image.url : 'なし')
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};