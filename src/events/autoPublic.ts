import { ChannelType, Events } from 'discord.js';
import { DiscordEventBuilder } from '../module/events';
import { getServerSetting } from '../module/mongo/middleware';

const autoPublic = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {
    if (!message.inGuild() || message.author.bot || message.system || message.channel.type !== ChannelType.GuildAnnouncement) return;

    const setting = await getServerSetting(message.guildId, 'autoPublic');
    if (!setting?.enable || !setting.channels.includes(message.channelId)) return;

    if (!message.crosspostable) return;
    message.crosspost().catch(() => message.reply('`❌` メッセージの公開に失敗しました'));
  },
});

export default [autoPublic];