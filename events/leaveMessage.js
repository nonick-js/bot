const ConfigSchema = require('../schemas/configSchema');
const PlaceHolder = require('../modules/placeholder');
const { PermissionFlagsBits, EmbedBuilder, Colors, Events } = require('discord.js');
const { isBlocked } = require('../utils/functions');

const leaveMessage = {
  name: Events.GuildMemberRemove,
  once: false,
  /** @param {import('discord.js').GuildMember} member */
  async execute(member) {
    if (!isBlocked(member.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: member.guild.id });
    if (!GuildConfig?.leave?.enable) return;

    const channel = await member.guild.channels.fetch(GuildConfig?.leave?.channel).catch(() => {});
    if (
      !channel?.permissionsFor(member.guild.members.me)
        ?.has(PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel)
    ) {
      await GuildConfig.updateOne({
        $set: {
          'leave.enable': false,
          'leave.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.username} の連携が解除されました`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setColor(Colors.Red);

      channel.send({ embeds: [embed] }).catch(() => {});
    }
    else {
      const leaveMessagePlaceHolder = new PlaceHolder()
        .register('serverName', ({ guild }) => guild.name)
        .register('memberCount', ({ guild }) => guild.memberCount)
        .register('user', ({ user }) => `<@${user}>`)
        .register('userName', ({ user }) => user.username)
        .register('userTag', ({ user }) => user.tag);

      const guild = member.guild;
      const user = member.user;

      channel.send(leaveMessagePlaceHolder.parse(GuildConfig.leave.message, { guild, user }))
        .catch(() => {});
    }
  },
};

module.exports = [ leaveMessage ];