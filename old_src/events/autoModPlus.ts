import { EmbedBuilder, escapeSpoiler, Events, formatEmoji, GuildBasedChannel, Message, PartialMessage, PermissionFlagsBits, resolveColor, time } from 'discord.js';
import { Emojis } from '../module/constant';
import { DiscordEventBuilder } from '../module/events';
import { getServerSetting } from '../module/mongo/middleware';

const shortUrlDomain = [
	'onl.bz',
	'x.gd',
	'goo.gl',
	'bit.ly',
	'is.gd',
	'v.gd',
	'ow.ly',
	'tiny.cc',
	'ux.nu',
	'00m.in',
];

const autoModPlusOnMessageCreate = new DiscordEventBuilder({
	type: Events.MessageCreate,
	execute: async (message) => checkMessage(message),
});

const autoModPlusOnMessageEdit = new DiscordEventBuilder({
	type: Events.MessageUpdate,
	execute: async (beforeMsg, afterMsg) => {
		afterMsg as Message<boolean> | PartialMessage;
		checkMessage(afterMsg.partial ? await afterMsg.fetch() : afterMsg);
	},
});

async function checkMessage(message: Message<boolean>) {
	if (!message.inGuild() || !message.member || message.author.bot || message.author.system || message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return;
	const setting = await getServerSetting(message.guildId, 'autoMod');

	if (
		!setting?.enable ||
		setting.ignore.channels.includes(message.channelId) ||
		message.member.roles.cache.some(role => setting.ignore.roles.includes(role.id))
	) return;

	const logCh = setting.log.enable && setting.log.channel ? await message.guild.channels.fetch(setting.log.channel) : null;

	if (setting.filter.inviteUrl) {
		const invites = await message.guild.invites.fetch();
		if (new RegExp(`(https?:\\/\\/)?(.*\\.)?discord(app)?\\.(com\\/invite|gg)\\/(?!${invites.map(invite => invite.code).join('|')})`).test(message.content)) deleteMessage(message, logCh, 'サーバー招待リンク');
	}
	if (setting.filter.token && (
		/mfa\.[a-z0-9_-]{20,}/i.test(message.content) ||
		/[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27}/i.test(message.content)
	)) deleteMessage(message, logCh, 'Discordアカウントのトークン');
	if (setting.filter.shortUrl && shortUrlDomain.some(domain => message.content.includes(domain))) deleteMessage(message, logCh, '短縮URL');
}

function deleteMessage(message: Message<true>, channel: GuildBasedChannel | null, rule?: string) {
	message.delete().then(() => {
		if (channel?.isTextBased())
			channel.send({
				embeds: [
					new EmbedBuilder()
						.setTitle('`✋` メッセージブロック')
						.setDescription([
							`${formatEmoji(Emojis.Gray.channel)} **チャンネル:** ${message.channel} [\`${message.channel.name}\`]`,
							`${formatEmoji(Emojis.Gray.member)} **送信者:** ${message.author} [\`${message.author.tag}\`]`,
							`${formatEmoji(Emojis.Gray.schedule)} ${message.editedAt ? `**編集時刻:** ${time(message.createdAt)}` : `**送信時刻:** ${time(message.createdAt)}`}`,
						].join('\n'))
						.setColor(resolveColor('#2b2d31'))
						.setThumbnail(message.author.displayAvatarURL())
						.setFields({ name: 'メッセージ', value: escapeSpoiler(message.content) })
						.setFooter({ text: `ルール: ${rule}` }),
				],
			});
	});
}

module.exports = [autoModPlusOnMessageCreate, autoModPlusOnMessageEdit];