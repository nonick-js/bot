import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  codeBlock,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'bulkdelete',
    ...createDescription('commands.bulkdelete.description'),
    options: [
      {
        name: 'messages',
        ...createDescription(
          'commands.bulkdelete.options.messages.description',
        ),
        type: ApplicationCommandOptionType.Integer,
        minValue: 2,
        maxValue: 100,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  },
  { coolTime: Duration.toMS('10s') },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!(interaction.inGuild() && interaction.channel)) return;
    if (interaction.appPermissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({
        content: langs.tl(
          'field.notPermitted',
          'label.notEnoughBotPermission',
          'label.permission.manageMessage',
        ),
        ephemeral: true,
      });
    const bulkCount = interaction.options.getInteger('messages', true);

    interaction.channel
      .bulkDelete(bulkCount, true)
      .then((msgs) =>
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(langs.tl('label.bulkdelete.success', msgs.size))
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        }),
      )
      .catch((err) =>
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [langs.tl('label.bulkdelete.failed'), codeBlock(err)].join(
                  '\n',
                ),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        }),
      );
  },
);
