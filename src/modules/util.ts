import AdmZip from 'adm-zip';
import axios from 'axios';
import { AttachmentBuilder, PermissionFlagsBits } from 'discord.js';
import type {
  Attachment,
  Collection,
  Guild,
  Message,
  Snowflake,
} from 'discord.js';
import { client } from 'index';

export async function getMessage(
  ...id: [guildId: string, channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(
  ...id: [channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(...id: string[]): Promise<Message> {
  const [messageId, channelId, guildId = null] = id.slice(0, 3).reverse();
  const guild = guildId
    ? await client.guilds.fetch(guildId).catch(() => null)
    : client;
  if (!guild) throw new URIError(`サーバーID:\`${guildId}\`に入っていません`);
  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased())
    throw new URIError(
      `チャンネルID:\`${channelId}\`が存在しないもしくはアクセスできません`,
    );
  const message = await channel.messages.fetch(messageId).catch(() => {});
  if (!message)
    throw new URIError(
      `メッセージID:\`${messageId}\`が存在しないもしくはアクセスできません`,
    );
  return message;
}

export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: false,
): `<:x:${C}>`;
export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: true,
): `<a:x:${C}>`;
export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: boolean,
): `<:x:${C}>` | `<a:x:${C}>`;
export function formatEmoji(emojiId: string, animated = false) {
  return `<${animated ? 'a' : ''}:x:${emojiId}>`;
}

export function range(max: number): Generator<number>;
export function range(min: number, max: number): Generator<number>;
export function* range(_min: number, _max = 0) {
  const [min, max] = _min < _max ? [_min, _max] : [_max, _min];
  for (let i = min; i < max; i++) yield i;
}

export async function createAttachment(
  attachments: Collection<string, Attachment>,
) {
  if (!attachments.size) return;
  const zip = new AdmZip();
  for await (const attachment of attachments.values()) {
    const res = await axios
      .get(attachment.url, { responseType: 'arraybuffer' })
      .catch(() => null);
    if (!res) continue;
    zip.addFile(attachment.name, res.data);
  }
  return new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
}

export async function getSendableChannel(guild: Guild, channelId: string) {
  const channel = await guild.channels.fetch(channelId);
  if (!channel?.isTextBased()) throw new TypeError('channel is not TextBased');
  const permissions = guild.members.me?.permissionsIn(channel);
  if (
    !(
      permissions?.has(PermissionFlagsBits.ViewChannel) &&
      permissions.has(PermissionFlagsBits.SendMessages)
    )
  )
    throw new ReferenceError("don't have permission");
  return channel;
}
