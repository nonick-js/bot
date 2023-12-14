import { AutomationSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { ChannelType, Events } from 'discord.js';
import { langs } from 'lang';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (
      !(
        message.inGuild() &&
        message.channel.type === ChannelType.GuildAnnouncement
      )
    )
      return;
    if (message.author.bot || message.author.system) return;

    const { publishAnnounce: setting } =
      (await AutomationSetting.findOne({ serverId: message.guild.id })) ?? {};
    if (!(setting?.enable && setting.channels.includes(message.channel.id)))
      return;

    if (!message.crosspostable) return;
    message
      .crosspost()
      .catch(() =>
        message.reply(langs.tl('automation.publishAnnounce.failed')),
      );
  },
});
