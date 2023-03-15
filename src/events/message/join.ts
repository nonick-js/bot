import { ChannelType, Colors, EmbedBuilder, Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';
import { joinAndLeaveMessagePlaceHolder } from '../../module/placeholders';

const joinMessage = new DiscordEventBuilder({
  type: Events.GuildMemberAdd,
  execute: async (member) => {

    if (isBlocked(member.guild)) return;

    const Setting = await ServerSettings.findOne({ serverId: member.guild.id });
    if (!Setting?.message.join.enable || !Setting.message.join.channel) return;

    const channel = await member.guild.channels.fetch(Setting.message.join.channel).catch(() => null);

    if (channel?.type !== ChannelType.GuildText) {
      Setting.message.join.enable = false;
      Setting.message.join.channel = null;
      return Setting.save({ wtimeout: 1500 });
    }

    if (member.user.bot) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
            .setColor(Colors.Green),
        ],
      })
      .catch(() => {});
    }
    else {
      const option = Setting.message.join.messageOptions;
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

module.exports = [joinMessage];