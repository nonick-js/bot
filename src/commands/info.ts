import { ChatInput, UserContext } from '@akki256/discord-interaction';
import { userFlag } from '@const/emojis';
import { formatEmoji } from '@modules/utils';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildFeature,
  PermissionFlagsBits,
  time,
} from 'discord.js';
import type {
  ChatInputCommandInteraction,
  GuildMemberRoleManager,
  RoleManager,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import { createDescription, createName, langs } from 'lang';
import { LangTemplate } from 'lang/template';

const featureTexts: Partial<Record<GuildFeature, keyof LangTemplate>> = {
  [GuildFeature.Partnered]: 'label.guildFeature.PARTNERED',
  [GuildFeature.Verified]: 'label.guildFeature.VERIFIED',
  [GuildFeature.Discoverable]: 'label.guildFeature.DISCOVERABLE',
};

const command = new ChatInput(
  {
    name: 'info',
    ...createDescription('commands.info.description'),
    options: [
      {
        name: 'user',
        ...createDescription('commands.info.user.description'),
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'user',
            ...createDescription('commands.info.user.user.description'),
            type: ApplicationCommandOptionType.User,
            required: true,
          },
        ],
      },
      {
        name: 'server',
        ...createDescription('commands.info.server.description'),
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    dmPermission: false,
  },
  async (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;

    const subCommand = interaction.options.getSubcommand();

    if (subCommand === 'user')
      return interaction.reply({
        embeds: [
          await createUserInfo(
            interaction,
            interaction.options.getUser('user', true),
          ),
        ],
        ephemeral: true,
      });
    if (subCommand === 'server')
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(interaction.guild.name)
            .setDescription(
              [
                langs.tl('field.serverId', interaction.guild.id),
                langs.tl('field.owner', await interaction.guild.fetchOwner()),
                langs.tl('field.memberCount', interaction.guild.memberCount),
                langs.tl(
                  'field.channelCount',
                  interaction.guild.channels.channelCountWithoutThreads,
                ),
                langs.tl('field.createAt', interaction.guild.createdAt),
                langs.tl(
                  'field.boostCount',
                  interaction.guild.premiumSubscriptionCount ?? 0,
                ),
              ].join('\n'),
            )
            .setColor(Colors.White)
            .setThumbnail(interaction.guild.iconURL())
            .setFields(
              {
                name: langs.tl('label.status'),
                value:
                  interaction.guild.features
                    .flatMap((feature) => {
                      const text = featureTexts[feature];
                      if (!text) return [];
                      return langs.tl(text);
                    })
                    .join('\n') || langs.tl('label.none'),
              },
              {
                name: langs.tl('label.roles'),
                value: interaction.member.permissions.has(
                  PermissionFlagsBits.ManageRoles,
                )
                  ? roleList(interaction.guild.roles)
                  : langs.tl(
                      'field.notPermitted',
                      'label.notPermitted',
                      'label.permission.manageRoles',
                    ),
              },
            ),
        ],
        ephemeral: true,
      });
  },
);

const context = new UserContext(
  {
    ...createName('contexts.infouser.name'),
    dmPermission: false,
  },
  async (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;

    return interaction.reply({
      embeds: [await createUserInfo(interaction, interaction.targetUser)],
      ephemeral: true,
    });
  },
);
export default [command, context];

async function createUserInfo(
  interaction:
    | ChatInputCommandInteraction<'cached'>
    | UserContextMenuCommandInteraction<'cached'>,
  user: User,
) {
  const member = await interaction.guild?.members
    .fetch(user.id)
    .catch(() => null);

  const userAvatar = user.displayAvatarURL();
  const userFlags = user.flags?.toArray().flatMap((flag) => {
    const emoji = userFlag[flag];
    if (!emoji) return [];
    return formatEmoji(emoji);
  });

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.tag })
    .setTitle(member ? null : langs.tl('label.notMember'))
    .setDescription(
      [
        member ? langs.tl('field.nickname', member) : '',
        langs.tl('field.id', user.id, 'label.userId'),
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .setColor(member ? member.displayColor || Colors.White : Colors.DarkerGrey)
    .setThumbnail(userAvatar)
    .setFields(
      {
        name: langs.tl('label.accountCreateAt'),
        value: time(user.createdAt, 'D'),
        inline: true,
      },
      {
        name: langs.tl('label.badges'),
        value: userFlags?.join(' ') || langs.tl('label.none'),
        inline: true,
      },
    );

  if (!member) return embed;
  embed
    .spliceFields(1, 0, {
      name: langs.tl('label.serverJoinAt'),
      value: member.joinedAt
        ? time(member.joinedAt, 'D')
        : langs.tl('label.error'),
      inline: true,
    })
    .addFields({
      name: langs.tl('label.roles'),
      value: roleList(member.roles),
    });

  if (member.premiumSince) {
    embed.addFields({
      name: langs.tl('label.boostSince'),
      value: `${time(member.premiumSince, 'D')} (${time(
        member.premiumSince,
        'R',
      )})`,
    });
  }

  if (
    member.isCommunicationDisabled() &&
    interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
  ) {
    embed.addFields({
      name: langs.tl('label.timeoutSchedule'),
      value: `${time(member.communicationDisabledUntil, 'D')} (${time(
        member.communicationDisabledUntil,
        'R',
      )})`,
    });
  }

  const memberAvatar = member.displayAvatarURL();
  if (memberAvatar !== userAvatar) {
    embed
      .setAuthor({ name: user.tag, iconURL: userAvatar })
      .setThumbnail(memberAvatar);
  }
  return embed;
}

function roleList(roles: RoleManager | GuildMemberRoleManager) {
  return (
    roles.cache
      .filter((role) => role.id !== role.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .join(' ') || langs.tl('label.none')
  );
}
