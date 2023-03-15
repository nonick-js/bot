import { ChannelType, Colors, EmbedBuilder, Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';
import { joinAndLeaveMessagePlaceHolder } from '../../module/placeholders';

const leaveMessage = new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  execute: async (member) => {

    if (isBlocked(member.guild)) return;

    const Setting = await ServerSettings.findOne({ serverId: member.guild.id });
    if (!Setting?.message.leave.enable || !Setting.message.leave.channel) return;

    const channel = await member.guild.channels.fetch(Setting.message.leave.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      Setting.message.leave.enable = false;
      Setting.message.leave.channel = null;
      return Setting.save({ wtimeout: 1500 });
    }

    if (member.user.bot) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} の連携が解除されました`, iconURL: member.user.displayAvatarURL() })
            .setColor(Colors.Red),
        ],
      }).catch(() => {});
    }
    else {
      const option = Setting.message.leave.messageOptions;
      if (!option) return;

      const guild = member.guild;
      const user = member.user;

      channel.send({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild, user })) || undefined,
        embeds: option.embeds?.map(v => EmbedBuilder.from(v)).map(v => {
          return EmbedBuilder.from(v)
            .setTitle(joinAndLeaveMessagePlaceHolder.parse(v.data.title || '', ({ guild, user })) || null)
            .setDescription(joinAndLeaveMessagePlaceHolder.parse(v.data.description || '', ({ guild, user })) || null)
            .setURL(v.data.url || null)
            .setColor(Colors.Green)
            .setThumbnail(member.user.displayAvatarURL());
        }),
      });
    }

  },
});

module.exports = [leaveMessage];