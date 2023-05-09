import { AttachmentBuilder, AuditLogEvent, Collection, Colors, EmbedBuilder, Events, GuildAuditLogsEntry, Message, MessageFlags } from 'discord.js';
import { Fields } from '../../module/constant';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';
import axios from 'axios';
import admZip from 'adm-zip';

const auditLogs = new Collection<string, GuildAuditLogsEntry<AuditLogEvent.MessageDelete> | undefined>();

const title = '`💬` メッセージ削除';

const deleteLog = new DiscordEventBuilder({
	type: Events.MessageDelete,
	execute: async (message) => {
		if (!message.inGuild()) return;
		if (isBlocked(message.guild)) return;
		if (message.client.user.equals(message.author) && message.embeds?.[0].title === title) return;
		if (message.flags.has(MessageFlags.Ephemeral)) return;

		const setting = await getServerSetting(message.guildId, 'log');
		if (!setting?.delete.enable || !setting.delete.channel) return;
		const logCh = await message.guild.channels.fetch(setting.delete.channel).catch(() => { });
		if (!logCh?.isTextBased()) return;
		const { executor } = await getAuditLog(message) ?? {};
		const beforeMessage = (await message.channel.messages.fetch({ before: message.id, limit: 1 })).first();

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setURL(beforeMessage?.url ?? null)
			.setDescription(Fields.multiLine(
				Fields.channelName(message.channel),
				Fields.memberTag(message.author, { text: '送信者' }),
				Fields.memberTag(executor ?? '送信者自身', { text: '削除者' }),
				Fields.schedule(message.createdAt, { text: '送信時刻' }),
			))
			.setColor(Colors.White)
			.setThumbnail(message.author?.avatarURL() ?? null)
			.setFields({ name: 'メッセージ', value: message.content || 'なし' });

		if (message.attachments.size) {
			const zip = new admZip();
			for await (const attachment of message.attachments.values()) {
				const res = await axios.get(attachment.url, { responseType: 'arraybuffer' }).catch(() => null);
				if (!res) continue;
				zip.addFile(attachment.name, res.data);
			}
			const attachment = new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
			logCh.send({ embeds: [embed], files: [attachment] });
		}
		else {
			logCh.send({ embeds: [embed] });
		}
	},
});

async function getAuditLog(message: Message<true>) {
	const { guild, author, channel } = message;
	const logs = await guild.fetchAuditLogs({
		limit: 3,
		type: AuditLogEvent.MessageDelete,
	});

	const log = logs.entries
		.sort(({ createdTimestamp: a }, { createdTimestamp: b }) => b - a)
		.find(entry => entry.target.equals(author) && entry.extra.channel.id === channel.id);

	const old = auditLogs.get(guild.id);
	auditLogs.set(guild.id, log);

	if (!log || (old?.id === log.id && old.extra.count >= log.extra.count)) return null;
	return log;
}

export default [deleteLog];