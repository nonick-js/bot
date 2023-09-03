import { Colors, EmbedBuilder, Message, time } from 'discord.js';
import { EmbedPagination } from './pagination';

export function urlExpansion(message: Message, guildId?: string) {
	/** @type {(RegExpMatchArray & {groups: {[K in 'guildId'|'channelId' |'messageId']: string}})[]} */
	const results = [...message.content.matchAll(/https:\/\/(?:.+\.)?discord(?:.+)?.com\/channels\/(?<guildId>\d+)\/(?<channelId>\d+)\/(?<messageId>\d+)/g)];
	results.forEach(async result => {
		if (!result.groups) return;
		try {
			if (guildId && result.groups.guildId !== guildId) return;

			const guild = await message.client.guilds.fetch(result.groups.guildId!);
			if (!guild) throw new URIError(`サーバーID:\`${result.groups.guildId}\`に入っていません`);
			const channel = await guild.channels.fetch(result.groups.channelId).catch(() => { });
			if (!(channel && channel.isTextBased())) throw new URIError(`チャンネルID:\`${result.groups.guildId}\`が存在しないもしくはアクセスできません`);
			const msg = await channel.messages.fetch(result.groups.messageId).catch(() => { });
			if (!msg) throw new URIError(`メッセージID:\`${result.groups.messageId}\`が存在しないもしくはアクセスできません`);

			const pagination = new EmbedPagination();

			const infoEmbed = new EmbedBuilder()
				.setTitle('メッセージ展開')
				.setColor('White')
				.setURL(result[0])
				.setAuthor({
					name: msg.member?.displayName ?? msg.author.tag,
					iconURL: msg.member?.displayAvatarURL() ?? msg.author.displayAvatarURL(),
				})
				.addFields(
					{ name: '送信時刻', value: time(msg.createdAt), inline: true },
				);
			const contentEmbeds = (msg.content.match(/.{1,1024}/gs) ?? []).map(content => new EmbedBuilder(infoEmbed.toJSON())
				.setDescription(content));
			const attachmentEmbeds = msg.attachments.map(attachment => new EmbedBuilder(infoEmbed.toJSON())
				.setImage(attachment.url));
			if (!contentEmbeds.concat(attachmentEmbeds).length) pagination.addPage(infoEmbed);
			pagination.addPages(...contentEmbeds, ...attachmentEmbeds, ...msg.embeds.map(v => EmbedBuilder.from(v)))
				.replyMessage(message, { allowedMentions: { parse: [] } });
		}
		catch (err) {
			console.log(err);
			const em = new EmbedBuilder()
				.setTitle('エラー!')
				.setColor(Colors.White)
				.setDescription('予期しないエラーが発生しました。');
			message.reply({ embeds: [em], allowedMentions: { parse: [] } });
		}
	});
}