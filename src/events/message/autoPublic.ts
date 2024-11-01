import { ChannelType, Events } from 'discord.js';
import { DiscordEventBuilder } from '@modules/events';
import { AutoPublicConfig } from '@models';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (!message.inGuild() || message.author.bot || message.system || message.channel.type !== ChannelType.GuildAnnouncement) return;
    const setting = await AutoPublicConfig.findOne({
      guildId: message.guild.id,
    });

    if (!setting?.enabled) return;
    if (!setting.channels.includes(message.channel.id)) return;

    if (!message.crosspostable) return;
    message.crosspost().catch(() => message.reply('`❌` メッセージの公開に失敗しました'));
  },
});