import { ChannelType, Events } from 'discord.js';
import { DiscordEventBuilder } from '../module/events';
import ServerSettings from '../schemas/ServerSettings';

const autoPublic = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: async (message) => {

    if (!message.inGuild() || message.author.bot || message.channel.type !== ChannelType.GuildAnnouncement) return;

    const Setting = await ServerSettings.findOne({ serverId: message.guildId });
    if (!Setting?.autoPublic.enable || !Setting.autoPublic.channels.includes(message.channelId)) return;

    if (!message.crosspostable) return;
    message.crosspost().catch(() => message.reply('`❌` メッセージの公開に失敗しました'));

  },
});

module.exports = [autoPublic];