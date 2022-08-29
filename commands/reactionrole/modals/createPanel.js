// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'createReactionRolePanel',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description') || null;
        const imageURL = interaction.fields.getTextInputValue('image') || null;

        const embed = new discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('516ff5');
        if (imageURL?.startsWith('http://') || imageURL?.startsWith('https://')) embed.setImage(imageURL);

        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-EditEmbed')
                .setEmoji('988439788132646954')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-AddRole')
                .setLabel('追加')
                .setEmoji('988439798324817930')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-DeleteRole')
                .setLabel('削除')
                .setEmoji('989089271275204608')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-Mode')
                .setLabel('単一選択')
                .setStyle(discord.ButtonStyle.Success),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-Send')
                .setLabel('送信')
                .setStyle(discord.ButtonStyle.Primary),
        );

        interaction.reply({ content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルにパネルを送信します。', embeds: [embed], components: [button], ephemeral: true });
    },
};
module.exports = [ ping_command ];