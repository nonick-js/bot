import { ChatInput } from '@akki256/discord-interaction';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, inlineCode } from 'discord.js';

const feature = [
  '入退室メッセージ', 'サーバー内通報',
  'モデレートログ', '認証レベル自動変更',
  'ロールパネル作成コマンド', '埋め込み作成コマンド',
];

const helpCommand = new ChatInput({
  name: 'help',
  description: 'このBOTについて',
  dmPermission: true,
}, (interaction) => {

  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(interaction.client.user.username)
        .setDescription([
          'サーバーの運営・成長に役立つ機能を搭載！',
          '「完全無料で使いやすい多機能BOT」を目指して日々開発しています',
        ].join('\n'))
        .setColor(Colors.Blurple)
        .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
        .setFooter({ text: '開発者・nonick-mc#1017', iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' })
        .setFields({ name: '搭載している機能の一部', value: feature.map(v => inlineCode(v)).join(' ') }),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        new ButtonBuilder()
          .setLabel('サポートサーバー')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.gg/fVcjCNn733'),
        new ButtonBuilder()
          .setLabel('使い方ガイド')
          .setStyle(ButtonStyle.Link)
          .setURL('https://docs.nonick-js.com'),
      ),
    ],
    ephemeral: true,
  });

});

export default  [helpCommand];