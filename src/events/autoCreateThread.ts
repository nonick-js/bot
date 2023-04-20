import { Events, MessageType } from 'discord.js';
import { DiscordEventBuilder } from '../module/events';
import { isBlocked } from '../module/functions';
import { getServerSetting } from '../module/mongo/middleware';

const autoCreateThread = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (
      !message.inGuild() ||
      isBlocked(message.guild) ||
      message.member?.user.bot ||
      message.webhookId ||
      message.type === MessageType.Reply
    ) return;

    const setting = await getServerSetting(message.guildId, 'autoCreateThread');
    if (!setting?.enable || !setting.channels.includes(message.channelId)) return;

    message.startThread({ name: '新しいスレッド' }).catch(() => {});
  },
});

export default [autoCreateThread];