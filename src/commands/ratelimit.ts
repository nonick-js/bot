import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'ratelimit',
    ...createDescription('commands.ratelimit.description'),
    options: [
      {
        name: 'duration',
        ...createDescription('commands.ratelimit.duration.description'),
        minValue: 0,
        maxValue: 21600,
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
  },
  { coolTime: Duration.toMS('5s') },
  (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel) return;

    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({
        content: langs.tl(
          'field.notPermitted',
          'label.notEnoughBotPermission',
          'label.permission.manageChannel',
        ),
        ephemeral: true,
      });

    const duration = interaction.options.getInteger('duration', true);
    interaction.channel
      .setRateLimitPerUser(duration, `/ratelimit by ${interaction.user.tag}`)
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(langs.tl('label.ratelimit.success', duration))
              .setColor(Colors.Green),
          ],
        });
      })
      .catch(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(langs.tl('label.ratelimit.failed'))
              .setColor(Colors.Red),
          ],
        });
      });
  },
);
