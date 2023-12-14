import { ChatInput } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'help',
    ...createDescription('commands.help.description'),
  },
  (interaction) => {
    langs.setLang(interaction.locale);
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(interaction.client.user.username)
          .setDescription(
            [langs.tl('label.aboutBot.0'), langs.tl('label.aboutBot.1')].join(
              '\n',
            ),
          )
          .setImage(
            'https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png',
          )
          .setColor(Colors.Blurple)
          .setFooter({
            text: langs.tl('label.developer', '@nonick-mc'),
            iconURL:
              'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png',
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel(langs.tl('label.supportServer'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/fVcjCNn733'),
          new ButtonBuilder()
            .setLabel(langs.tl('label.documents'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://docs.nonick-js.com'),
        ),
      ],
      ephemeral: true,
    });
  },
);
