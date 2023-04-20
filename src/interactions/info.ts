import { ApplicationCommandOptionType, bold, Colors, EmbedBuilder, formatEmoji, GuildFeature, GuildMember, inlineCode, Interaction, PermissionFlagsBits, time, User } from 'discord.js';
import { ChatInput, UserContext } from '@akki256/discord-interaction';
import { Emojis } from '../module/constant';

const flagEmojis = new Map([
  ['Staff', '966753508739121222'],
  ['Partner', '966753508860768357'],
  ['CertifiedModerator', '959536411894243378'],
  ['Hypesquad', '966753508961439745'],
  ['HypeSquadOnlineHouse1', '966753508843978872'],
  ['HypeSquadOnlineHouse2', '966753508927889479'],
  ['HypeSquadOnlineHouse3', '966753508776890459'],
  ['BugHunterLevel1', '966753508848205925'],
  ['BugHunterLevel2', '966753508755898410'],
  ['ActiveDeveloper', '1040345950318768218'],
  ['VerifiedDeveloper', '966753508705583174'],
  ['PremiumEarlySupporter', '966753508751736892'],
]);

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
          .setDescription([
            `${formatEmoji(Emojis.White.id)} サーバーID: \`${interaction.guildId}\``,
            `${formatEmoji(Emojis.White.nickName)} オーナー: ${await interaction.guild.fetchOwner()}`,
            `${formatEmoji(Emojis.White.nickName)} メンバー数: \`${interaction.guild.memberCount}\`人`,
            `${formatEmoji(Emojis.White.channel)} チャンネル数: \`${interaction.guild.channels.channelCountWithoutThreads}\``,
            `${formatEmoji(Emojis.White.schedule)} 作成日: ${time(interaction.guild.createdAt, 'D')}`,
            `${formatEmoji(Emojis.White.boost)} ブースト数: \`${interaction.guild.premiumSubscriptionCount}\``,
          ].join('\n'))
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

  const userFlags = user.flags?.toArray();
  const userFlagsEmojis = userFlags?.map(v => flagEmojis.get(v)).filter(Boolean);

  if (!(member instanceof GuildMember)) {
    return new EmbedBuilder()
      .setAuthor({ name: user.tag })
      .setTitle('このユーザーはこのサーバーにいません')
      .setDescription(`${formatEmoji(Emojis.White.id)} ユーザーID: ${inlineCode(user.id)}`)
      .setColor(Colors.DarkerGrey)
      .setThumbnail(user.displayAvatarURL())
      .setFields(
        { name: 'アカウント作成日', value: time(user.createdAt, 'D'), inline: true },
        { name: 'バッジ', value: userFlagsEmojis ? userFlagsEmojis.map(v => formatEmoji(v || '0')).join('') : 'なし', inline: true },
      );
  }

  const nickName = member.nickname ?? 'なし';
  const joinTime = member.joinedAt ? time(member.joinedAt, 'D') : 'エラー';
  const roles = member.roles.cache
    .filter(role => role.name !== '@everyone')
    .sort((before, after) => before.position > after.position ? -1 : 1)
    ?.map(role => role?.toString())?.join(' ') || 'なし';

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.tag })
    .setDescription([
      `${formatEmoji(Emojis.White.nickName)} ニックネーム ${bold(nickName)}`,
      `${formatEmoji(Emojis.White.id)} ユーザーID ${inlineCode(user.id)}`,
    ].join('\n'))
    .setColor(member.roles.highest.color || Colors.White)
    .setThumbnail(user.displayAvatarURL())
    .setFields(
      { name: 'アカウント作成日', value: time(user.createdAt, 'D'), inline: true },
      { name: 'サーバー参加日', value: joinTime, inline: true },
      { name: 'バッジ', value: userFlagsEmojis?.length ? userFlagsEmojis.map(v => formatEmoji(v || '0')).join('') : 'なし', inline: true },
      { name: 'ロール', value: roles },
    );

  if (member.premiumSince) {
    embed.addFields({
      name: `${formatEmoji(Emojis.White.boost)} SERVER BOOST`,
      value: `ブーストを開始した日: ${time(member.premiumSince, 'D')} (${time(member.premiumSince, 'R')})`,
    });
  }

  if (member.isCommunicationDisabled() && interaction.inCachedGuild() && interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    embed.addFields({
      name: `${formatEmoji(Emojis.White.timeOut)} タイムアウトが解除される時間`,
      value: `${time(member.communicationDisabledUntil, 'D')} (${time(member.communicationDisabledUntil, 'R')})`,
    });
  }

  if (user.displayAvatarURL() !== user.displayAvatarURL()) {
    embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
    embed.setThumbnail(member.displayAvatarURL());
  }

  return embed;
}

export default [Command, Context];