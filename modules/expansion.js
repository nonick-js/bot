const discord = require('discord.js');
const Pagination = require('./pagination');

/** @param {import('discord.js').Message} message */
function urlExpansion(message) {
	/** @type {(RegExpMatchArray & {groups: {[K in 'guildId'|'channelId' |'messageId']: string}})[]} */
	const results = [...message.content.matchAll(/https:\/\/(?:.+\.)?discord(?:.+)?.com\/channels\/(?<guildId>\d+)\/(?<channelId>\d+)\/(?<messageId>\d+)/g)];
	results.forEach(async result => {
		try {
			const guild = await message.client.guilds.fetch(result.groups.guildId).catch(() => {});
			if (!guild) throw new URIError(`サーバーID:\`${result.groups.guildId}\`に入っていません`);
			const channel = await guild.channels.fetch(result.groups.channelId).catch(() => {});
			if (!(channel && channel.isTextBased())) throw new URIError(`チャンネルID:\`${result.groups.guildId}\`が存在しないもしくはアクセスできません`);
			const msg = await channel.messages.fetch(result.groups.messageId).catch(() => {});
			if (!msg) throw new URIError(`メッセージID:\`${result.groups.messageId}\`が存在しないもしくはアクセスできません`);

			const pagination = new Pagination();

			const infoEmbed = new discord.EmbedBuilder()
				.setTitle('メッセージ展開')
				.setColor('White')
				.setURL(result[0])
				.setAuthor({
					name: msg.member?.displayName ?? msg.author.tag,
					iconURL: msg.member?.displayAvatarURL({ dynamic: true }) ?? msg.author.displayAvatarURL({ dynamic: true }),
				})
				.addFields(
					{ name: '送信時刻', value: discord.time(msg.createdAt), inline:true },
				);
			const contentEmbeds = (msg.content.match(/.{1,1024}/g) ?? []).map(content => {
				return new discord.EmbedBuilder(infoEmbed.toJSON())
					.setDescription(content);
			});
			const attachmentEmbeds = msg.attachments.map(attachment => {
				return new discord.EmbedBuilder(infoEmbed.toJSON())
					.setImage(attachment.url);
			});
			if (!contentEmbeds.concat(attachmentEmbeds).length) pagination.addPage(infoEmbed);
			pagination.addPages(...contentEmbeds, ...attachmentEmbeds, ...msg.embeds)
				.replyMessage(message, { allowedMentions: { parse: [] } });
		}
		catch (err) {
			const em = new discord.EmbedBuilder()
				.setTitle('エラー!')
				.setColor('FF0000')
				.setDescription(err.message);
			message.reply({ embeds: [em], allowedMentions: { parse: [] } });
		}
	});
}

module.exports = { urlExpansion };