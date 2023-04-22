import { APIEmbed, Colors, EmbedBuilder, Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { joinAndLeaveMessagePlaceHolder } from '../../module/placeholders';
import { getServerSetting } from '../../module/mongo/middleware';

const leaveMessage = new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  execute: async (member) => {
    if (isBlocked(member.guild) || member.id === member.client.user.id) return;

    const setting = await getServerSetting(member.guild.id, 'message');
    if (!setting?.leave.enable || !setting.leave.channel) return;

    const channel = await member.guild.channels.fetch(setting.leave.channel).catch(() => null);
    if (!channel?.isTextBased()) return;

    if (member.user.bot) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({ name: `${member.user.username} の連携が解除されました`, iconURL: member.user.displayAvatarURL() })
            .setColor(Colors.Red),
        ],
      }).catch(() => { });
    }

    else {
      const option = setting.leave.messageOptions;
      if (!option) return;

      channel.send({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild: member.guild, user: member.user })) || undefined,
        embeds: option.embeds?.map(embed => {
          const data = 'toJSON' in embed ? embed.toJSON() : embed;
          return EmbedBuilder.from(joinAndLeaveMessagePlaceHolder.parse(data, { guild: member.guild, user: member.user }))
            .setURL(data?.url || null)
            .setColor(Colors.Green)
            .setThumbnail(member.user.displayAvatarURL())
        }),
      });
    }

  },
});

export default [leaveMessage];