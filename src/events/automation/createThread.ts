import { AutomationSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { setLang } from '@modules/utils';
import { Events, MessageType } from 'discord.js';
import { langs } from 'lang';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    if (message.author.bot || message.author.system) return;
    if (message.type === MessageType.Reply) return;
    const { createThread: setting } =
      (await AutomationSetting.findOne({ serverId: message.guild.id })) ?? {};
    if (!(setting?.enable && setting.channels.includes(message.channel.id)))
      return;

    await setLang(message.guild.id);
    message.startThread({ name: langs.tl('label.newThread') }).catch(() => {});
  },
});
