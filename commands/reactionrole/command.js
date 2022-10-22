const discord = require('discord.js');
const FeatureData = require('../../schemas/featureDataSchema');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'reactionrole',
    description: 'リアクションロールパネルを作成します',
    options: [
      { name: 'type', description: '種類', type: discord.ApplicationCommandOptionType.String, choices: [
        { name: 'ボタン', value: 'button' },
        { name: 'セレクトメニュー', value: 'selectMenu' },
      ], required: true },
      { name: 'title', description: '埋め込みのタイトル', type: discord.ApplicationCommandOptionType.String, max_length: 1000, required: false },
      { name: 'description', description: '埋め込みの説明 (半角2スペースで改行)', type: discord.ApplicationCommandOptionType.String, max_length: 4000, required: false },
      { name: 'color', description: '埋め込みの色', type: discord.ApplicationCommandOptionType.String, choices: [
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
    const type = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description')?.split('  ')?.join('\n');
    const color = interaction.options.getString('color');
    const attachment = interaction.options.getAttachment('attachment');

    if (!title && !description) {
      const errorEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: '「タイトル」と「説明」はどちらか片方は必ず入力する必要があります！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const embed = new discord.EmbedBuilder()
      .setTitle(title)
      .setDescription(description || null)
      .setColor(color || 'White')
      .setImage(attachment?.contentType?.startsWith('image/') ? attachment.url : null);

    const button = new discord.ActionRowBuilder().setComponents(
      new discord.ButtonBuilder()
        .setCustomId('reactionRole-editEmbed')
        .setEmoji('988439788132646954')
        .setStyle(discord.ButtonStyle.Secondary),
    );

    if (type == 'button') {
      const GuildFeatureData = await FeatureData.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $setOnInsert: { serverId: interaction.guildId } },
        { upsert: true, new: true },
      );

      if (GuildFeatureData.reactionRole.button.messages.length >= (GuildFeatureData.reactionRole.button.max ?? 10)) {
        const errorEmbed = new discord.EmbedBuilder()
          .setAuthor({ name: 'これ以上パネルを作成できません！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
          .setDescription(`このサーバーではパネルを**${GuildFeatureData.reactionRole.button.max ?? 10}**個まで作成できます！\n新しくパネルを作成するには、**既存のパネルを削除してください！**`)
          .setColor('Red');
        return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      embed.addFields({ name: 'ロール (送信時に非表示になります)', value: '`なし`' });
      button.addComponents(
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_button-addRole')
          .setLabel('追加')
          .setEmoji('988439798324817930')
          .setStyle(discord.ButtonStyle.Secondary),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_button-deleteRole')
          .setLabel('削除')
          .setEmoji('989089271275204608')
          .setDisabled(true)
          .setStyle(discord.ButtonStyle.Secondary),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_button-changeStyle')
          .setEmoji('🎨')
          .setStyle(discord.ButtonStyle.Primary),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_button-sendPanel')
          .setLabel('送信')
          .setDisabled(true)
          .setStyle(discord.ButtonStyle.Primary),
      );
    }

    if (type == 'selectMenu') {
      button.addComponents(
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_selectMenu-addRole')
          .setLabel('追加')
          .setEmoji('988439798324817930')
          .setStyle(discord.ButtonStyle.Secondary),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_selectMenu-deleteRole')
          .setLabel('削除')
          .setEmoji('989089271275204608')
          .setStyle(discord.ButtonStyle.Secondary),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_selectMenu-changeMode')
          .setLabel('単一選択')
          .setStyle(discord.ButtonStyle.Success),
        new discord.ButtonBuilder()
          .setCustomId('reactionRole_selectMenu-sendPanel')
          .setLabel('送信')
          .setStyle(discord.ButtonStyle.Primary),
      );
    }

    interaction.reply({ content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルにパネルを送信します。', embeds: [embed], components: [button], ephemeral: true });
  },
};
module.exports = [ commandInteraction ];