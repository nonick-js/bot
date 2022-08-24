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
    data: { name: 'reactionrole', description: '新しいリアクションロールパネルを作成', descriptionLocalizations: { 'en-US': 'Create a new reaction role panel' }, type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ あなたにはこのコマンドを使用する権限がありません!\n必要な権限: `ロールを管理`')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const modal = new discord.Modal()
            .setCustomId('reactionRoleSetting')
            .setTitle('リアクションロールパネル')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('title')
                        .setLabel('タイトル')
                        .setMaxLength(1000)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('description')
                        .setLabel('説明')
                        .setMaxLength(4000)
                        .setStyle('PARAGRAPH')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('image')
                        .setLabel('画像URL')
                        .setPlaceholder('http(s):// から始まるURLのみ対応しています。')
                        .setMaxLength(1000)
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};