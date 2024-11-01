import { Guild } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Events } from 'discord.js';

const GuildCache = new Set<string>();

const onGuildCreate = new DiscordEventBuilder({
  type: Events.GuildCreate,
  async execute(guild) {
    createGuild(guild.id);
  },
});

const onMessageCreate = new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    createGuild(message.guild.id);
  },
});

const onGuildDelete = new DiscordEventBuilder({
  type: Events.GuildDelete,
  async execute(guild) {
    Guild.deleteOne({ guildId: guild.id }).then(() =>
      GuildCache.delete(guild.id),
    );
  },
});

async function createGuild(guildId: string) {
  if (GuildCache.has(guildId) || (await Guild.findOne({ guildId }))) return;

  const res = await Guild.create({ guildId });
  res.save().then(() => GuildCache.add(guildId));
}

export default [onGuildCreate, onMessageCreate, onGuildDelete];
