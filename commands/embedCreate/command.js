// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'embed',
        description: '埋め込みを作成します',
        options: [
            { name: 'title', description: 'タイトル', type: discord.ApplicationCommandOptionType.String, max_length: 1000, required: true },
            { name: 'description', description: '説明 (2スペースで改行)', type: discord.ApplicationCommandOptionType.String, max_length: 4000, required: false },
            { name: 'color', description: '色', type: discord.ApplicationCommandOptionType.String, choices: [
                { name: '🔴赤色', value: 'Red' },
                { name: '🟠橙色', value: 'Orange' },
                { name: '🟡黄色', value: 'Yellow' },
                { name: '🟢緑色', value: 'Green' },
                { name: '🔵青色', value: 'Blue' },
                { name: '🟣紫色', value: 'Purple' },
                { name: '⚪白色', value: 'White' },
            ], required: false },
            { name: 'attachment', description: '画像', type: discord.ApplicationCommandOptionType.Attachment, required: false },
        ],
        dmPermission: false,
        defaultMemberPermissions: discord.PermissionFlagsBits.ManageMessages | discord.PermissionFlagsBits.AttachFiles | discord.PermissionFlagsBits.EmbedLinks,
        type: 'CHAT_INPUT',
    },
    exec: async (interaction) => {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description')?.split('  ')?.join('\n');
        const attachment = interaction.options.getAttachment('attachment');
        const color = interaction.options.getString('color');

        const embed = new discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description || null)
            .setColor(color || 'White')
            .setImage(attachment?.contentType?.startsWith('image/') ? attachment.url : null);
        const button1 = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('embed-basic')
                .setLabel('基本')
                .setEmoji('966596708458983484')
                .setStyle(discord.ButtonStyle.Success),
            new discord.ButtonBuilder()
                .setCustomId('embed-image')
                .setLabel('画像')
                .setEmoji('1018167020824576132')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('embed-author')
                .setLabel('投稿者')
                .setEmoji('1005688190931320922')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('embed-footer')
                .setLabel('フッター')
                .setEmoji('1005688190931320922')
                .setStyle(discord.ButtonStyle.Secondary),
        );
        const button2 = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('embed-addField')
                .setLabel('フィールド')
                .setEmoji('988439798324817930')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('embed-removeField')
                .setLabel('フィールド')
                .setEmoji('989089271275204608')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('embed-sendEmbed')
                .setLabel('送信')
                .setStyle(discord.ButtonStyle.Primary),
        );

        interaction.reply({ content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルに埋め込みを送信します。', embeds: [embed], components: [button1, button2], ephemeral: true });
    },
};
module.exports = [ ping_command ];