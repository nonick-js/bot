import { Emojis } from '@modules/constant';
import { DiscordEventBuilder } from '@modules/events';
import { getServerSetting } from '@modules/mongo/middleware';
import AdmZip from 'adm-zip';
import { AttachmentBuilder, AuditLogEvent, Collection, Colors, EmbedBuilder, Events, GuildAuditLogsEntry, Message, User, formatEmoji, time } from 'discord.js';
import axios from 'axios';
import { Duration } from '@modules/format';

const lastAuditLog = new Collection<string, GuildAuditLogsEntry<AuditLogEvent.MessageDelete>>();

export default new DiscordEventBuilder({
  type: Events.MessageDelete,
  async execute(message) {
    if (!message.inGuild()) return;
    const { executor } = await getAuditLog(message) ?? { executor: null };
    sendLog(message, executor);
  },
});

async function sendLog(message: Message<true>, executor: User | null) {
  const { delete: setting } = await getServerSetting(message.guildId, 'log') ?? {};
  if (!(setting?.enable && setting.channel)) return;
  const channel = await message.guild.channels.fetch(setting.channel).catch(() => null);
  if (!channel?.isTextBased()) return;
  const beforeMessage = await message.channel.messages.fetch({ before: message.id, limit: 1 }).then(v => v.first());
  const embed = new EmbedBuilder()
    .setTitle('`💬` メッセージ削除')
    .setURL(beforeMessage?.url ?? null)
    .setDescription([
      `${formatEmoji(Emojis.Gray.channel)} **チャンネル:** ${message.channel} [\`${message.channel.name}\`]`,
      `${formatEmoji(Emojis.Gray.member)} **送信者:** ${message.author} [\`${message.author.tag}\`]`,
      `${formatEmoji(Emojis.Gray.member)} **削除者:** ${executor ? `${executor} [\`${executor.tag}\`]` : '送信者自身'}`,
      `${formatEmoji(Emojis.Gray.schedule)} **送信時刻:** ${time(message.createdAt)}`,
    ].join('\n'))
    .setColor(Colors.White)
    .setThumbnail(message.author?.avatarURL() ?? null)
    .setFields({ name: 'メッセージ', value: message.content || 'なし' });
  if (message.stickers.size) embed.addFields({
    name: 'スタンプ',
    value: message.stickers.map(v => v.name).join('\n'),
  });
  if (message.attachments.size) {
    const zip = new AdmZip();
    for await (const attachment of message.attachments.values()) {
      const res = await axios.get(attachment.url, { responseType: 'arraybuffer' }).catch(() => null);
      if (!res) continue;
      zip.addFile(attachment.name, res.data);
    }
    channel.send({ embeds: [embed], files: [new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' })] });
  }
  channel.send({ embeds: [embed] });
}

async function getAuditLog(message: Message<true>) {
  const entry = await message.guild.fetchAuditLogs({ type: AuditLogEvent.MessageDelete, limit: 3 })
    .then(v => v.entries.find(e => (
      e.target.equals(message.author) &&
      e.extra.channel.id === message.channel.id &&
      ((Date.now() - e.createdTimestamp) < Duration.toMS('1m'))
    )));
  const lastLog = lastAuditLog.get(message.guildId);
  if (entry && (
    !lastLog ||
    (lastLog.id !== entry.id) ||
    (lastLog.extra.count < entry.extra.count)
  )) {
    lastAuditLog.set(message.guildId, entry);
    return entry;
  }
}

