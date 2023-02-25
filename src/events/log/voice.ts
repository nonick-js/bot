import { ChannelType, Colors, EmbedBuilder, Events, formatEmoji } from 'discord.js';
import { GrayEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import ServerSettings from '../../schemas/ServerSettings';

const voiceLog = new DiscordEventBuilder({
	type: Events.VoiceStateUpdate,
	async execute(oldState, newState) {

		if (isBlocked(newState.guild) || !newState.member) return;

		const Setting = await ServerSettings.findOne({ serverId: newState.guild.id });

		if (!Setting?.log.voice.enable || !Setting?.log.voice.channel) return;

		const channel = await newState.guild.channels.fetch(Setting?.log.voice.channel).catch(() => null);

		if (channel?.type !== ChannelType.GuildText) {
			Setting.log.voice.enable = false;
			Setting.log.voice.channel = null;
			Setting.save({ wtimeout: 1500 });
			return;
		}

		if (oldState.channel && newState.channel && !oldState.channel.equals(newState.channel)) {
			channel
				.send({ embeds: [
					new EmbedBuilder()
						.setTitle('`🔊` チャンネル移動')
						.setDescription([
							`${formatEmoji(GrayEmojies.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
							`${formatEmoji(GrayEmojies.channel)} **チャンネル移動元:** ${oldState.channel.id}`,
							`${formatEmoji(GrayEmojies.channel)} **チャンネル移動先:** ${newState.channel.id}`,
						].join('\n'))
						.setColor(Colors.Yellow)
						.setThumbnail(newState.member.displayAvatarURL())
						.setTimestamp(),
				] });
		}
		else if (!oldState.channel && newState.channel) {
			channel
				.send({ embeds: [
					new EmbedBuilder()
						.setTitle('`🔊` チャンネル参加')
						.setDescription([
							`${formatEmoji(GrayEmojies.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
							`${formatEmoji(GrayEmojies.channel)} **チャンネル:** ${newState.channel.id}`,
						].join('\n'))
						.setColor(Colors.Red)
						.setThumbnail(newState.member.displayAvatarURL())
						.setTimestamp(),
				] });
		}
		else if (oldState.channel && !newState.channel) {
			channel
				.send({ embeds: [
					new EmbedBuilder()
						.setTitle('`🔊` チャンネル退出')
						.setDescription([
							`${formatEmoji(GrayEmojies.member)} **メンバー:** ${newState.member} [${newState.member.user.tag}]`,
							`${formatEmoji(GrayEmojies.channel)} **チャンネル:** ${oldState.channel.id}`,
						].join('\n'))
						.setColor(Colors.Red)
						.setThumbnail(newState.member.displayAvatarURL())
						.setTimestamp(),
				] });
		}
	},
});

module.exports = [voiceLog];