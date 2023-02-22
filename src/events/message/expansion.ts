import { Events } from 'discord.js';
import { DiscordEventBuilder } from '../../module/events';
import { urlExpansion } from '../../module/expansion';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const messageExpansion = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {

    if (isBlocked(message.guild) || message.channel.isDMBased()) return;

    const Setting = await ServerSettings.findOne({ serverId: message.guildId });

    if (
      !Setting?.message.expansion.enable ||
      Setting.message.expansion.ignore.types.includes(message.channel.type) ||
      Setting.message.expansion.ignore.ids.includes(message.channelId)
    ) return;

    urlExpansion(message, message.guildId ?? undefined);

  },
});

module.exports = [messageExpansion];