import { Colors, EmbedBuilder, Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { joinAndLeaveMessagePlaceHolder } from '../../module/placeholders';
import { getServerSetting } from '../../module/mongo/middleware';

const joinMessage = new DiscordEventBuilder({
  type: Events.GuildMemberAdd,
  execute: async (member) => {
    if (isBlocked(member.guild)) return;

    const setting = await getServerSetting(member.guild.id, 'message');
    if (!setting?.join.enable || !setting.join.channel) return;

    const channel = await member.guild.channels.fetch(setting.join.channel).catch(() => null);
    if (!channel?.isTextBased()) return;

    if (member.user.bot) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
            .setColor(Colors.Green),
        ],
      }).catch(() => { });
    }

    else {
      const option = setting.join.messageOptions;
      if (!option) return;

      const guild = member.guild;
      const user = member.user;

      channel.send({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild, user })) || undefined,
        embeds: option.embeds?.map(v => EmbedBuilder.from(v)).map(v => EmbedBuilder.from(v)
          .setTitle(joinAndLeaveMessagePlaceHolder.parse(v.data.title || '', ({ guild, user })) || null)
          .setDescription(joinAndLeaveMessagePlaceHolder.parse(v.data.description || '', ({ guild, user })) || null)
          .setURL(v.data.url || null)
          .setColor(Colors.Green)
          .setThumbnail(member.user.displayAvatarURL())),
      });
    }
  },
});

export default [joinMessage];