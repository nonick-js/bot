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
    data: { name: 'reactionrole', description: '新しいリアクションロールパネルを作成します。', type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            const embed = new discord.MessageEmbed()
                .setDescription([
                    '❌ あなたにはこのコマンドを使用する権限がありません!',
                    '必要な権限: `ロールを管理`',
                ].join('\n'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const modal = new discord.Modal()
            .setCustomId('reactionRoleSetting')
            .setTitle('セレクトロールパネル')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('title')
                        .setLabel('埋め込みのタイトル')
                        .setMaxLength(1000)
                        .setStyle('SHORT')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('description')
                        .setLabel('埋め込みの説明')
                        .setPlaceholder('このセレクトロールについて説明しよう')
                        .setMaxLength(4000)
                        .setStyle('PARAGRAPH')
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('image')
                        .setLabel('埋め込みに乗せる画像URL')
                        .setPlaceholder('http(s):// から始まるURLのみ対応しています。')
                        .setMaxLength(500)
                        .setStyle('SHORT'),
                ),
            );
        interaction.showModal(modal);
    },
};