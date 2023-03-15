import { ChannelType, Colors, EmbedBuilder, Events, Guild, User } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { PlaceHolder } from '../../module/format';
import ServerSettings from '../../schemas/ServerSettings';

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

    if (member.user.bot)
      channel
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
              .setColor(Colors.Green),
          ],
        })
        .catch(() => { });

    else {
      const joinMessagePlaceHolder = new PlaceHolder<{ guild: Guild, user: User }>()
        .register('serverName', ({ guild }) => guild?.name)
        .register('memberCount', ({ guild }) => guild?.memberCount)
        .register('user', ({ user }) => `${user}`)
        .register('userName', ({ user }) => user?.username)
        .register('userTag', ({ user }) => user?.tag);

      const option = Setting.message.join.messageOptions;
      if (!option) return;

      const guild = member.guild;
      const user = member.user;

      const content = joinMessagePlaceHolder.parse(option.content || '', ({ guild, user })) || undefined;
      const embeds = option.embeds?.map(v => EmbedBuilder.from(v)).map(v => EmbedBuilder.from(v)
        .setTitle(joinMessagePlaceHolder.parse(v.data.title || '', ({ guild, user })) || null)
        .setDescription(joinMessagePlaceHolder.parse(v.data.description || '', ({ guild, user })) || null)
        .setURL(v.data.url || null)
        .setColor(Colors.Green)
        .setThumbnail(member.user.displayAvatarURL()));

      channel.send({ content, embeds });
    }
  },
});

module.exports = [joinMessage];