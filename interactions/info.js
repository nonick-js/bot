const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Colors, inlineCode, ButtonStyle } = require('discord.js');

const feature = [
  '入退室メッセージ',
  'サーバー内通報',
  'モデレートログ',
  '認証レベル自動変更',
  'ロールパネル作成コマンド',
  '埋め込み作成コマンド',
];

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'info',
    description: 'BOTに関する情報を表示',
    dmPermission: true,
    coolTime: 3000,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(interaction.client.user.username)
      .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
      .setDescription([
        'サーバーの運営・成長に役立つ機能を搭載！',
        '「完全無料で使いやすい多機能BOT」を目指して日々開発しています。',
      ].join('\n'))
      .setColor(Colors.White)
      .setFields({
        name: '搭載している機能の一部',
        value: feature.map(v => inlineCode(v)).join(' '),
      })
      .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
      .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' });

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel('サポートサーバー')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/fVcjCNn733'),
      new ButtonBuilder()
        .setLabel('使い方ガイド')
        .setStyle(ButtonStyle.Link)
        .setURL('https://docs.nonick-js.com'),
    );

    interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
  },
};

module.exports = [ commandInteraction ];