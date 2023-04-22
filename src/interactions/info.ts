import { ApplicationCommandOptionType, bold, Colors, discordSort, EmbedBuilder, formatEmoji, GuildFeature, GuildMember, Interaction, PermissionFlagsBits, time, User } from 'discord.js';
import { ChatInput, UserContext } from '@akki256/discord-interaction';
import { Emojis, Fields } from '../module/constant';

const featureTexts = new Map<string, string>([
  [GuildFeature.Partnered, `${formatEmoji('982512900432351262')}Discordパートナー`],
  [GuildFeature.Verified, `${formatEmoji('982512902042955806')}認証済み`],
  [GuildFeature.Discoverable, `${formatEmoji('1087358252691496960')}公開サーバー`],
]);

const Command = new ChatInput({
  name: 'info',
  description: 'ユーザー/サーバー の情報を表示',
  options: [
    {
      name: 'user',
      description: 'ユーザーの情報を表示',
      options: [
        {
          name: 'user',
          description: 'ユーザー',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'server',
      description: 'サーバーの情報を表示',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  dmPermission: false,
}, async (interaction) => {
  if (!interaction.inCachedGuild()) return;
  const subCommand = interaction.options.getSubcommand();

  if (subCommand === 'user') return interaction.reply({ embeds: [await createUserInfoEmbed(interaction, interaction.options.getUser('user', true))], ephemeral: true });

  if (subCommand === 'server') {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(interaction.guild.name)
          .setDescription(Fields.multiLine(
            Fields.id(interaction.guild, { text: 'サーバーID' }),
            Fields.nickName(await interaction.guild.fetchOwner(), { text: 'オーナー' }),
            `${formatEmoji(Emojis.White.nickName)} メンバー数: \`${interaction.guild.memberCount}\`人`,
            `${formatEmoji(Emojis.White.channel)} チャンネル数: \`${interaction.guild.channels.channelCountWithoutThreads}\``,
            Fields.schedule(interaction.guild.createdAt, { text: '作成日', flag: 'D' }),
            `${formatEmoji(Emojis.White.boost)} ブースト数: \`${interaction.guild.premiumSubscriptionCount}\``,
          ))
          .setColor(Colors.White)
          .setThumbnail(interaction.guild.iconURL())
          .setFields(
            { name: 'ステータス', value: interaction.guild.features.map(v => featureTexts.get(v)).filter(Boolean).join('\n') || 'なし' },
            {
              name: `ロール (${interaction.guild.roles.cache.size})`,
              value: interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)
                ? interaction.guild.roles.cache
                  .filter(role => role.name !== '@everyone')
                  .sort((before, after) => before.position > after.position ? -1 : 1)
                  ?.map(role => role?.toString())?.join(' ') || 'なし'
                : '🔒`ロールを管理`権限を持っている必要があります',
            },
          ),
      ],
      ephemeral: true,
    });
  }
});

const Context = new UserContext({
  name: 'ユーザーの情報',
  dmPermission: false,
}, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  return interaction.reply({ embeds: [await createUserInfoEmbed(interaction, interaction.targetUser)], ephemeral: true });
});

async function createUserInfoEmbed(interaction: Interaction, user: User) {
  const member = await interaction.guild?.members.fetch(user.id).catch(() => undefined);
  const userIcon = user.displayAvatarURL();

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.tag })
    .setDescription(Fields.id(user, { text: 'ユーザーID' }))
    .setThumbnail(userIcon)
    .setFields(
      { name: 'アカウント作成日', value: time(user.createdAt, 'D'), inline: true },
      {
        name: 'バッジ',
        value: user.flags?.toArray()?.flatMap(v => {
          const id = Emojis.Flags.User[v];
          if (!id) return [];
          return formatEmoji(id);
        })?.join('') ?? 'なし',
        inline: true,
      },
    )

  if (!(member instanceof GuildMember)) {
    return embed
      .setTitle('このユーザーはこのサーバーにいません')
      .setColor(Colors.DarkerGrey);
  }

  embed
    .setDescription(Fields.multiLine(
      Fields.nickName(member),
      embed.data.description
    ))
    .setColor(member.displayColor || Colors.White)
    .spliceFields(1, 0, {
      name: 'サーバー参加日',
      value: member.joinedAt ? time(member.joinedAt, 'D') : 'エラー',
      inline: true,
    })
    .addFields({
      name: 'ロール',
      value: discordSort(member.roles.cache.filter(({ id }) => id !== member.guild.id))
        .map(role => role.toString())
        .join(' ') || 'なし',
      inline: true
    });

  if (member.premiumSince) {
    embed.addFields({
      name: `${formatEmoji(Emojis.White.boost)} SERVER BOOST`,
      value: `ブーストを開始した日: ${time(member.premiumSince, 'D')} (${time(member.premiumSince, 'R')})`,
    });
  }

  if (
    member.isCommunicationDisabled() &&
    interaction.inCachedGuild() &&
    interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
  ) {
    embed.addFields({
      name: `${formatEmoji(Emojis.White.timeOut)} タイムアウトが解除される時間`,
      value: `${time(member.communicationDisabledUntil, 'D')} (${time(member.communicationDisabledUntil, 'R')})`,
    });
  }

  const memberIcon = member.displayAvatarURL();
  if (userIcon !== memberIcon) {
    embed.setAuthor({ name: user.tag, iconURL: userIcon });
    embed.setThumbnail(memberIcon);
  }

  return embed;
}

export default [Command, Context];