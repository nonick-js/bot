import { AutomationSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Events, MessageType } from 'discord.js';

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

    message.startThread({ name: '新しいスレッド' }).catch(() => {});
  },
});
