const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'reactionrole',
    description: 'リアクションロールパネルを作成します',
    options: [
      { name: 'title', description: 'タイトル', type: discord.ApplicationCommandOptionType.String, max_length: 1000, required: true },
      { name: 'description', description: '説明 (半角2スペースで改行)', type: discord.ApplicationCommandOptionType.String, max_length: 4000, required: false },
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
    defaultMemberPermissions: discord.PermissionFlagsBits.ManageRoles | discord.PermissionFlagsBits.ManageMessages,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description')?.split('  ')?.join('\n');
    const color = interaction.options.getString('color');
    const attachment = interaction.options.getAttachment('attachment');

    const embed = new discord.EmbedBuilder()
      .setTitle(title)
      .setDescription(description || null)
      .setColor(color || 'White')
      .setImage(attachment?.contentType?.startsWith('image/') ? attachment.url : null);

    const button = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-editEmbed')
        .setEmoji('988439788132646954')
        .setStyle(discord.ButtonStyle.Secondary),
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-addRole')
        .setLabel('追加')
        .setEmoji('988439798324817930')
        .setStyle(discord.ButtonStyle.Secondary),
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-deleteRole')
        .setLabel('削除')
        .setEmoji('989089271275204608')
        .setStyle(discord.ButtonStyle.Secondary),
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-changeMode')
        .setLabel('単一選択')
        .setStyle(discord.ButtonStyle.Success),
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-sendPanel')
        .setLabel('送信')
        .setStyle(discord.ButtonStyle.Primary),
      );

    interaction.reply({ content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルにパネルを送信します。', embeds: [embed], components: [button], ephemeral: true });
  },
};
module.exports = [ commandInteraction ];