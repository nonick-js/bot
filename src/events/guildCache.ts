import { Events } from 'discord.js';
import { DiscordEventBuilder } from '../module/events';
import GuildCache from '../schemas/GuildCaches';

const manageGuildCache = [
  new DiscordEventBuilder({
    type: Events.GuildCreate,
    execute: async (guild) => {
      findOneAndCreateGuildCache(guild.id);
    },
  }),
  new DiscordEventBuilder({
    type: Events.GuildDelete,
    execute: async (guild) => {
      GuildCache.deleteOne({ serverId: guild.id }).exec();
    },
  }),
  new DiscordEventBuilder({
    type: Events.MessageCreate,
    execute: async (message) => {
      if (!message.inGuild()) return;
      findOneAndCreateGuildCache(message.guildId);
    },
  }),
];

async function findOneAndCreateGuildCache(guildId: string) {
  if (await GuildCache.findOne({ serverId: guildId })) return;
  (await GuildCache.create({ serverId: guildId })).save();
}

module.exports = [...manageGuildCache];