import { AutoCreateThreadConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    const setting = await AutoCreateThreadConfig.findOne({
      guildId: message.guild.id,
    });

    if (!setting?.enabled) return;
    if (!setting.channels.includes(message.channel.id)) return;

    message.startThread({
      name: `${message.author.displayName}のスレッド`,
      reason: 'auto thread create',
    });
  },
});
