import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'firstmessage',
    ...createDescription('commands.firstmessage.description'),
    options: [
      {
        name: 'content',
        ...createDescription('commands.firstmessage.context.description'),
        type: ApplicationCommandOptionType.String,
        maxLength: 200,
      },
      {
        name: 'label',
        ...createDescription('commands.firstmessage.label.description'),
        type: ApplicationCommandOptionType.String,
        maxLength: 80,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: [
      PermissionFlagsBits.ManageChannels,
      PermissionFlagsBits.ManageMessages,
    ],
  },
  { coolTime: Duration.toMS('50s') },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!(interaction.inGuild() && interaction.channel)) return;

    interaction.channel.messages
      .fetch({ after: '0', limit: 1 })
      .then((messages) => {
        const message = messages.first();
        if (!message) throw new ReferenceError();
        interaction.reply({
          content: interaction.options.getString('content') ?? undefined,
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder()
                .setLabel(
                  interaction.options.getString('label') ??
                    langs.tl('label.firstmessage.default'),
                )
                .setURL(message.url)
                .setStyle(ButtonStyle.Link),
            ),
          ],
        });
      })
      .catch(() => {
        interaction.reply({
          content: langs.tl('label.firstmessage.failed'),
          ephemeral: true,
        });
      });
  },
);
