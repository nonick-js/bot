import { Colors, EmbedBuilder, Events, formatEmoji } from 'discord.js';
import { Emojis } from '../../module/constant';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';

const voiceLog = new DiscordEventBuilder({
	type: Events.VoiceStateUpdate,
	execute: async (oldState, newState) => {
		if (isBlocked(newState.guild) || !newState.member) return;

		const setting = await getServerSetting(newState.guild.id, 'log');
		if (!setting?.voice.enable || !setting?.voice.channel) return;

		const channel = await newState.guild.channels.fetch(setting.voice.channel).catch(() => null);
		if (!channel?.isTextBased()) return;

		if (oldState.channel && newState.channel && !oldState.channel.equals(newState.channel))
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル移動')
							.setDescription([
								`${formatEmoji(Emoji.Gray.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
								`${formatEmoji(Emoji.Gray.channel)} **チャンネル移動元:** ${oldState.channel} [${oldState.channel.name}]`,
								`${formatEmoji(Emoji.Gray.channel)} **チャンネル移動先:** ${newState.channel} [${newState.channel.name}]`,
							].join('\n'))
							.setColor(Colors.Yellow)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});

		else if (!oldState.channel && newState.channel)
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル参加')
							.setDescription([
								`${formatEmoji(Emoji.Gray.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
								`${formatEmoji(Emoji.Gray.channel)} **チャンネル:** ${newState.channel} [${newState.channel.name}]`,
							].join('\n'))
							.setColor(Colors.Green)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});

		else if (oldState.channel && !newState.channel)
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル退出')
							.setDescription([
								`${formatEmoji(Emoji.Gray.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
								`${formatEmoji(Emoji.Gray.channel)} **チャンネル:** ${oldState.channel} [${oldState.channel.name}]`,
							].join('\n'))
							.setColor(Colors.Red)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});
	},
});

module.exports = [voiceLog];