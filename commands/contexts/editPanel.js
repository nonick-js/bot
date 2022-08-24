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
    exec: async (client, interaction) => {

        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ あなたにはこのコマンドを使用する権限がありません!\n必要な権限: `ロールを管理`')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const message = interaction.targetMessage;

        if (message.author.id !== client.user.id || !message.embeds[0] || !message.components[0]) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ それはリアクションロールパネルではありません!')
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
                .setDescription('❌ それはリアクションロールパネルではありません!')
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
                .setCustomId('reactionRole-Edit')
                .setLabel('編集')
                .setStyle('PRIMARY'),
        );

        interaction.reply({ content: '**プレビューモード**\n「編集」ボタンを押すとパネルの編集を終了します。', embeds: [panelEmbed], components: [message.components[0], button], ephemeral: true });
    },
};