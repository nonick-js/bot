import { AutoCreateVoiceConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import {
  ChannelType,
  Events,
  OverwriteType,
  PermissionFlagsBits,
} from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if (!newState.member) return;

    const setting = await AutoCreateVoiceConfig.findOne({
      guildId: oldState.guild.id,
    });

    if (!(setting?.enabled && setting.lobby && setting.category)) return;
    const category = await oldState.guild.channels
      .fetch(setting.category)
      .catch(() => null);
    if (category?.type !== ChannelType.GuildCategory) {
      AutoCreateVoiceConfig.updateOne(
        { guildId: oldState.guild.id },
        { $set: { enabled: false, category: null, lobby: null } },
      );
      return;
    }

    if (newState.channel?.id === setting.lobby) {
      console.info('create');
      const newVC = await category.children.create({
        name: `${newState.member.displayName}'s VC`,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          ...category.permissionOverwrites.cache.values(),
          {
            id: newState.member.id,
            allow: [PermissionFlagsBits.ManageChannels],
            type: OverwriteType.Member,
          },
        ],
      });
      newState.member.voice.setChannel(newVC);
    }
    if (
      oldState.channel?.parent &&
      category.equals(oldState.channel.parent) &&
      oldState.channel.id !== setting.lobby &&
      oldState.channel.members.size === 0
    ) {
      oldState.channel.delete('Auto created Voice Channel');
    }
  },
});
