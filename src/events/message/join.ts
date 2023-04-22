import { APIEmbed, Colors, EmbedBuilder, Events } from 'discord.js';
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

      channel.send({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild: member.guild, user: member.user })) || undefined,
        embeds: option.embeds?.map(embed => {
          const data = 'toJSON' in embed ? embed.toJSON() : embed;
          return EmbedBuilder.from(joinAndLeaveMessagePlaceHolder.parse(embed, { guild: member.guild, user: member.user }))
            .setURL(data?.url || null)
            .setColor(Colors.Green)
            .setThumbnail(member.user.displayAvatarURL())
        }),
      });
    }
  },
});

export default [joinMessage];