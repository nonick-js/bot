import { Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { urlExpansion } from '../../module/expansion';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';

const messageExpansion = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (isBlocked(message.guild) || !message.inGuild()) return;

    const setting = await getServerSetting(message.guildId, 'message');
    if (
      !setting?.expansion.enable ||
      setting.expansion.ignore.types.includes(message.channel.type) ||
      setting.expansion.ignore.channels.includes(message.channelId)
    ) return;

    urlExpansion(message, message.guildId ?? undefined);
  },
});

export default [messageExpansion];