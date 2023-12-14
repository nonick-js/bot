import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  codeBlock,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'timeout',
    ...createDescription('commands.timeout.description'),
    options: [
      {
        name: 'user',
        ...createDescription('commands.timeout.user.description'),
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'date',
        ...createDescription('commands.timeout.date.description'),
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'hour',
        ...createDescription('commands.timeout.hour.description'),
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'minute',
        ...createDescription('commands.timeout.minute.description'),
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'reason',
        ...createDescription('commands.timeout.reason.description'),
        type: ApplicationCommandOptionType.String,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    dmPermission: false,
  },
  { coolTime: Duration.toMS('5s') },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;

    const member = interaction.options.getMember('user');
    const duration = Duration.toMS(
      [
        `${interaction.options.getNumber('date') ?? 0}d`,
        `${interaction.options.getNumber('hour') ?? 0}h`,
        `${interaction.options.getNumber('minute') ?? 0}m`,
      ].join(''),
    );

    if (duration <= 0)
      return interaction.reply({
        content: langs.tl('label.timeout.failed.notEnoughTime'),
        ephemeral: true,
      });
    if (Duration.toMS('28d') < duration)
      return interaction.reply({
        content: langs.tl('label.timeout.failed.timeTooMany'),
        ephemeral: true,
      });
    if (!(member instanceof GuildMember))
      return interaction.reply({
        content: langs.tl('label.timeout.failed.notExistsMember'),
        ephemeral: true,
      });
    if (member.user.equals(interaction.user))
      return interaction.reply({
        content: langs.tl('label.timeout.failed.yourself'),
        ephemeral: true,
      });
    if (!member.moderatable)
      return interaction.reply({
        content: langs.tl('field.notPermitted', 'label.notEnoughBotPermission'),
        ephemeral: true,
      });
    if (
      interaction.guild.ownerId !== interaction.user.id &&
      interaction.member.roles.highest.position < member.roles.highest.position
    )
      return interaction.reply({
        content: langs.tl('label.timeout.failed.notPermittedTimeout'),
        ephemeral: true,
      });

    member
      .timeout(
        duration,
        `${
          interaction.options.getString('reason') ?? langs.tl('label.noReason')
        } - ${interaction.user.tag}`,
      )
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                langs.tl('label.timeout.success', member, duration),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [langs.tl('label.timeout.failed'), codeBlock(err)].join('\n'),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      });
  },
);
