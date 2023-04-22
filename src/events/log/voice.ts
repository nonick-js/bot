import { Colors, EmbedBuilder, Events, formatEmoji } from 'discord.js';
import { Emojis, Fields } from '../../module/constant';
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

		if (oldState.channel && newState.channel && !oldState.channel.equals(newState.channel)) {
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル移動')
							.setDescription(Fields.multiLine(
								Fields.memberTag(newState.member),
								Fields.channelName(oldState.channel, { text: 'チャンネル移動元' }),
								Fields.channelName(newState.channel, { text: 'チャンネル移動先' }),
							))
							.setColor(Colors.Yellow)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});
		}

		else if (!oldState.channel && newState.channel) {
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル参加')
							.setDescription(Fields.multiLine(
								Fields.memberTag(newState.member),
								Fields.channelName(newState.channel),
							))
							.setColor(Colors.Green)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});
		}

		else if (oldState.channel && !newState.channel) {
			channel
				.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('`🔊` チャンネル退出')
							.setDescription(Fields.multiLine(
								Fields.memberTag(newState.member),
								Fields.channelName(oldState.channel),
							))
							.setColor(Colors.Red)
							.setThumbnail(newState.member.displayAvatarURL())
							.setTimestamp(),
					],
				});
		}
	},
});

export default [voiceLog];