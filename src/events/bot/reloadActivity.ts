import { DiscordEventBuilder } from '@modules/events';
import { ActivityType, type Client, Events } from 'discord.js';

const onGuildCreate = new DiscordEventBuilder({
  type: Events.GuildCreate,
  execute: (guild) => setActivity(guild.client),
});

const onGuildDelete = new DiscordEventBuilder({
  type: Events.GuildDelete,
  execute: (guild) => setActivity(guild.client),
});

function setActivity(client: Client<true>) {
  client.user.setActivity({
    name: `${client.application.approximateGuildCount} サーバー`,
    type: ActivityType.Competing,
  });
}

export default [onGuildCreate, onGuildDelete];
