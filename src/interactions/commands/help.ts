import { ChatInput } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'help',
    description: 'このBOTについて',
  },
  (interaction) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(interaction.client.user.username)
          .setDescription(
            [
              'サーバーの運営・成長に役立つ機能を搭載！',
              '「完全無料で使いやすい多機能BOT」を目指して日々開発しています',
            ].join('\n'),
          )
          .setImage(
            'https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png',
          )
          .setColor(Colors.Blurple)
          .setFooter({
            text: '開発者: @nonick-mc',
            iconURL:
              'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png',
          }),
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
  },
);
