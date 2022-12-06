const { EmbedBuilder, time, formatEmoji, Colors, PermissionFlagsBits } = require('discord.js');

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

/** @type {import('@akki256/discord-interaction').UserRegister} */
const contextMenuInteraction = {
  data: {
    name: 'ユーザーの情報',
    dmPermission: false,
    type: 'USER',
  },
  exec: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.targetUser;
    const member = interaction.targetMember;

    const flags = user.flags.toArray().map(v => flagEmojis.get(v)).filter(Boolean).map(v => formatEmoji(v)).join('') || 'なし';
    const createTime = time(Math.floor(user.createdTimestamp / 1000), 'D');

    if (!member) {
      const embed = new EmbedBuilder()
        .setAuthor({ name: user.tag })
        .setColor(Colors.DarkerGrey)
        .setTitle('このユーザーはこのサーバーにいません')
        .setDescription(`${formatEmoji('1005688192818761748')} ユーザーID: \`${user.id}\``)
        .setFields(
          { name: 'アカウント作成日時', value: createTime, inline: true },
          { name: 'フラッグ', value: flags, inline: true },
        )
        .setThumbnail(user.displayAvatarURL());

      return interaction.followUp({ embeds: [embed] });
    }

    const nickName = member.nickname || 'なし';
    const joinTime = time(Math.floor(member.joinedTimestamp / 1000), 'D');

    const boostTimeStamp = Math.floor(member.premiumSinceTimestamp / 1000);
    const timeoutDisableTimeStamp = Math.floor(member.communicationDisabledUntilTimestamp / 1000);

    const roles = member.roles.cache.filter(role => role.name !== '@everyone').sort((before, after) => {
      if (before.position > after.position) return -1;
			return 1;
    })?.map(role => role.toString())?.join(' ') || 'なし';

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.tag })
      .setColor(member.roles.highest.color || Colors.White)
      .setDescription([
        `${formatEmoji('1005688190931320922')} ニックネーム: **${nickName}**`,
        `${formatEmoji('1005688192818761748')} ユーザーID: \`${user.id}\``,
      ].join('\n'))
      .setFields(
        { name: 'アカウント作成日', value: createTime, inline: true },
        { name: 'サーバー参加日', value: joinTime, inline: true },
        { name: 'フラッグ', value: flags, inline: true },
        { name: 'ロール', value: roles, inline: true },
      )
      .setThumbnail(user.displayAvatarURL());

    if (boostTimeStamp) {
      embed.addFields({
        name: `${formatEmoji('896591259886567434')} SERVER BOOST`,
        value: `ブーストを開始した日: ${time(boostTimeStamp, 'D')} (${time(boostTimeStamp, 'R')})`,
      });
    }

    if (timeoutDisableTimeStamp && (Math.floor(Date.now() / 1000)) < timeoutDisableTimeStamp && interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      embed.addFields({
        name: `${formatEmoji('1016740772340576306')} タイムアウトが解除される時間`,
        value: `${time(timeoutDisableTimeStamp, 'D')} (${time(timeoutDisableTimeStamp, 'R')})`,
      });
    }

    if (user.displayAvatarURL() !== member.displayAvatarURL()) {
      embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL });
      embed.setThumbnail(member.displayAvatarURL);
    }

    interaction.followUp({ embeds: [embed] });
  },
};

module.exports = [ contextMenuInteraction ];