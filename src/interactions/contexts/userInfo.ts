import { bold, Colors, EmbedBuilder, formatEmoji, GuildMember, inlineCode, PermissionFlagsBits, time } from 'discord.js';
import { UserContext } from '@akki256/discord-interaction';
import { WhiteEmojies } from '../../module/emojies';

const flagEmojies = new Map([
  ['Staff',                 '966753508739121222'],
  ['Partner',               '966753508860768357'],
  ['CertifiedModerator',    '959536411894243378'],
  ['Hypesquad',             '966753508961439745'],
  ['HypeSquadOnlineHouse1', '966753508843978872'],
  ['HypeSquadOnlineHouse2', '966753508927889479'],
	['HypeSquadOnlineHouse3', '966753508776890459'],
  ['BugHunterLevel1',       '966753508848205925'],
  ['BugHunterLevel2',       '966753508755898410'],
	['ActiveDeveloper',       '1040345950318768218'],
  ['VerifiedDeveloper',     '966753508705583174'],
  ['PremiumEarlySupporter', '966753508751736892'],
]);

const userInfoContext = new UserContext(
  {
    name: 'ユーザーの情報',
    dmPermission: false,
  },
  async (interaction) => {

    await interaction.deferReply({ ephemeral: true });

    const user = interaction.targetUser;
    const member = interaction.targetMember;
    const userFlags = user?.flags?.toArray();
    const userFlagsEmojies = userFlags?.map(v => flagEmojies.get(v)).filter(Boolean);
    const createTime = time(Math.floor(user.createdTimestamp / 1000), 'D');

    if (!(member instanceof GuildMember)) {
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: user.tag })
            .setTitle('このユーザーはこのサーバーにいません')
            .setDescription(`${formatEmoji(WhiteEmojies.id)} ユーザーID: ${inlineCode(user.id)}`)
            .setColor(Colors.DarkerGrey)
            .setThumbnail(user.displayAvatarURL())
            .setFields(
              { name: 'アカウント作成日', value: createTime, inline: true },
              { name: 'バッジ', value: userFlagsEmojies ? userFlagsEmojies.map(v => formatEmoji(v || '0')).join('') : 'なし', inline: true },
            ),
        ],
      });
    }

    const nickName = member.nickname ?? 'なし';
    const joinTime = member.joinedTimestamp ? time(Math.floor(member.joinedTimestamp / 1000), 'D') : 'エラー';
    const roles = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .sort((before, after) => before.position > after.position ? -1 : 1)
      ?.map(role => role?.toString())?.join(' ') || 'なし';

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag })
      .setDescription([
        `${formatEmoji(WhiteEmojies.nickName)} ニックネーム ${bold(nickName)}`,
        `${formatEmoji(WhiteEmojies.id)} ユーザーID ${inlineCode(user.id)}`,
      ].join('\n'))
      .setColor(member.roles.highest.color || Colors.White)
      .setThumbnail(user.displayAvatarURL())
      .setFields(
        { name: 'アカウント作成日', value: createTime, inline: true },
        { name: 'サーバー参加日', value: joinTime, inline: true },
        { name: 'バッジ', value: userFlagsEmojies ? userFlagsEmojies.map(v => formatEmoji(v || '0')).join('') : 'なし', inline: true },
        { name: 'ロール', value: roles },
      );

    if (member.premiumSinceTimestamp) {
      const boostTimeStamp = Math.floor(member.premiumSinceTimestamp / 1000);

      embed.addFields({
        name: `${formatEmoji(WhiteEmojies.boost)} SERVER BOOST`,
        value: `ブーストを開始した日: ${time(boostTimeStamp, 'D')} (${time(boostTimeStamp, 'R')})`,
      });
    }

    if (member.isCommunicationDisabled()) {
      if (Date.now() > member.communicationDisabledUntilTimestamp) return;
      if (!interaction.inCachedGuild()) return;
      if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

      const timeoutDisableTimeStamp = Math.floor(member.communicationDisabledUntilTimestamp / 1000);

      embed.addFields({
        name: `${formatEmoji(WhiteEmojies.timeOut)} タイムアウトが解除される時間`,
        value: `${time(timeoutDisableTimeStamp, 'D')} (${time(timeoutDisableTimeStamp, 'R')})`,
      });
    }

    if (user.displayAvatarURL() !== user.displayAvatarURL()) {
      embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
      embed.setThumbnail(member.displayAvatarURL());
    }

    interaction.followUp({ embeds: [embed] });

  },
);

module.exports = [userInfoContext];