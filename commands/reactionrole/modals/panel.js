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
    exec: async (client, interaction) => {

        const imageURL = interaction.fields.getTextInputValue('image');
        const embed = new discord.MessageEmbed()
            .setTitle(interaction.fields.getTextInputValue('title'))
            .setDescription(interaction.fields.getTextInputValue('description'))
            .setColor('516ff5');
        if (imageURL) if (imageURL.startsWith('http://') || imageURL.startsWith('https://')) embed.setImage(imageURL);

        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('reactionRole-EditEmbed')
                .setEmoji('988439788132646954')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-AddRole')
                .setLabel('追加')
                .setEmoji('988439798324817930')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-DeleteRole')
                .setLabel('削除')
                .setEmoji('989089271275204608')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('reactionRole-Mode')
                .setLabel('単一選択')
                .setStyle('SUCCESS'),
            new discord.MessageButton()
                .setCustomId('reactionRole-Send')
                .setLabel('送信')
                .setStyle('PRIMARY'),
        );
        interaction.reply({ content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルにパネルを送信します。', embeds: [embed], components: [button], ephemeral: true });
    },
};