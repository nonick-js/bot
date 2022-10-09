const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'setting',
    description: 'コントロールパネル(設定)を開きます',
    dmPermission: false,
    defaultMemberPermissions: discord.PermissionFlagsBits.ManageGuild,
    type: 'CHAT_INPUT',
    coolTime: 10000,
  },
  exec: async (interaction) => {
    const embed = new discord.EmbedBuilder()
      .setAuthor({ name: '設定', iconURL: interaction.client.user.displayAvatarURL() })
      .setDescription([
        `**${interaction.client.user.username}**のコントロールパネルへようこそ！`,
        'ここではこのBOTの設定を変更することができます。[詳細はこちら](https://docs.nonick-js.com/tutorial/setting/)',
        '```セレクトメニューから設定を閲覧・変更したい機能を選択しよう！```',
      ].join('\n'))
      .setColor('Green');

    const button = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId('setting-whatsNew')
        .setLabel('What\'s New')
        .setEmoji('966588719643631666')
        .setStyle(discord.ButtonStyle.Primary),
    );
    const select = new discord.ActionRowBuilder().addComponents(
      new discord.SelectMenuBuilder()
        .setCustomId('setting-featureCategory')
        .addOptions([
          { label: '入退室メッセージ機能', value: 'setting-welcomeMessage', emoji: '🚪' },
          { label: '通報機能', value: 'setting-report', emoji: '📢' },
          { label: 'リンク展開機能', value: 'setting-messageExpansion', emoji: '🔗' },
          { label: 'ログ機能', value: 'setting-log', emoji: '📑' },
          { label: '認証レベル自動変更機能', value: 'setting-verification', emoji: '✅' },
        ]),
    );

    interaction.reply({ embeds: [embed], components: [select, button], ephemeral: true });
  },
};
module.exports = [ commandInteraction ];