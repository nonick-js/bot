const ConfigSchema = require('../schemas/configSchema');
const PlaceHolder = require('../modules/placeholder');
const { EmbedBuilder, Colors, Events } = require('discord.js');
const { isBlocked } = require('../utils/functions');

const welcomeMessage = {
  name: Events.GuildMemberAdd,
  once: false,
  /** @param {import('discord.js').GuildMember} member */
  async execute(member) {
    if (isBlocked(member.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: member.guild.id });
    if (!GuildConfig?.welcome?.enable) return;

    const channel = await member.guild.channels.fetch(GuildConfig?.welcome?.channel).catch(() => {});
    if (!channel) {
      await GuildConfig.updateOne({
        $set: {
          'welcome.enable': false,
          'welcome.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    if (member.user.bot) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${member.user.username} が連携されました`,
          iconURL: member.user.displayAvatarURL(),
        })
        .setColor(Colors.Blue);

      channel.send({ embeds: [embed] }).catch(() => {});
    }
    else {
      const welcomeMessagePlaceHolder = new PlaceHolder()
        .register('serverName', ({ guild }) => guild.name)
        .register('memberCount', ({ guild }) => guild.memberCount)
        .register('user', ({ user }) => `<@${user}>`)
        .register('userName', ({ user }) => user.username)
        .register('userTag', ({ user }) => user.tag);

      const guild = member.guild;
      const user = member.user;

      const embed = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(welcomeMessagePlaceHolder.parse(GuildConfig.welcome.message, { guild, user }))
        .setColor(Colors.Green)
        .setThumbnail(member.user.displayAvatarURL());

      channel.send({ embeds: [embed] }).catch(() => {});
    }
  },
};

module.exports = [ welcomeMessage ];