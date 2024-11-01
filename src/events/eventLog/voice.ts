import { EventLogConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { channelField, userField } from '@modules/fields';
import { Colors, EmbedBuilder, Events } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if (!newState.member) return;

    const config = await EventLogConfig.findOne({ guildId: oldState.guild.id });
    if (!config?.voice.enabled || !config?.voice.channel) return;

    const channel = await newState.guild.channels
      .fetch(config.voice.channel)
      .catch(() => null);
    if (!channel?.isTextBased()) return;

    if (
      oldState.channel &&
      newState.channel &&
      !oldState.channel.equals(newState.channel)
    )
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル移動')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(oldState.channel, { label: 'チャンネル移動元' }),
                channelField(newState.channel, { label: 'チャンネル移動先' }),
              ].join('\n'),
            )
            .setColor(Colors.Yellow)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    else if (!oldState.channel && newState.channel)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル参加')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(newState.channel, { label: 'チャンネル' }),
              ].join('\n'),
            )
            .setColor(Colors.Green)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    else if (oldState.channel && !newState.channel)
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル退出')
            .setDescription(
              [
                userField(newState.member.user, { label: 'メンバー' }),
                channelField(oldState.channel, { label: 'チャンネル' }),
              ].join('\n'),
            )
            .setColor(Colors.Red)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
  },
});
