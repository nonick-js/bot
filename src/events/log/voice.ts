import { Emojis } from '@modules/constant';
import { DiscordEventBuilder } from '@modules/events';
import { getServerSetting } from '@modules/mongo/middleware';
import { Colors, EmbedBuilder, Events, formatEmoji } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.VoiceStateUpdate,
  execute: async (oldState, newState) => {
    if (!newState.member) return;
    const { voice } = await getServerSetting(newState.guild.id, 'log') ?? {};
    if (!(voice?.enable && voice.channel)) return;
    const channel = await newState.guild.channels.fetch(voice.channel).catch(() => null);
    if (!channel?.isTextBased()) return;
    if (oldState.channel && newState.channel && !oldState.channel.equals(newState.channel)) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル移動')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **メンバー:** ${newState.member} [\`${newState.member.user.tag}\`]`,
              `${formatEmoji(Emojis.Gray.channel)} **チャンネル移動元:** ${oldState.channel} [\`${oldState.channel.name}\`]`,
              `${formatEmoji(Emojis.Gray.channel)} **チャンネル移動先:** ${newState.channel} [\`${newState.channel.name}\`]`,
            ].join('\n'))
            .setColor(Colors.Yellow)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    }
    else if (!oldState.channel && newState.channel) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル参加')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **メンバー:** ${newState.member} [\`${newState.member.user.tag}\`]`,
              `${formatEmoji(Emojis.Gray.channel)} **チャンネル:** ${newState.channel} [\`${newState.channel.name}\`]`,
            ].join('\n'))
            .setColor(Colors.Green)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    }
    else if (!newState.channel && oldState.channel) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔊` チャンネル退出')
            .setDescription([
              `${formatEmoji(Emojis.Gray.member)} **メンバー:** ${newState.member} [\`${newState.member.user.tag}\`]`,
              `${formatEmoji(Emojis.Gray.channel)} **チャンネル:** ${oldState.channel} [\`${oldState.channel.name}\`]`,
            ].join('\n'))
            .setColor(Colors.Red)
            .setThumbnail(newState.member.displayAvatarURL())
            .setTimestamp(),
        ],
      });
    }
  },
});