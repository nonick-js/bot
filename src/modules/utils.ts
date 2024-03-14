import { GeneralSetting } from '@models';
import type { Locale, Message, Snowflake } from 'discord.js';
import { client } from 'index';
import { langs } from 'lang';

export async function setLang(serverId: string) {
  const setting = await GeneralSetting.findOne({ serverId });
  if (setting?.lang) langs.setLang(setting.lang as Locale);
}

export async function getMessage(
  ...id: [guildId: string, channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(
  ...id: [channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(...id: string[]): Promise<Message> {
  const guild =
    id.length > 2 ? await client.guilds.fetch(id[0]).catch(() => null) : client;
  if (!guild) throw new URIError(`サーバーID:\`${id[0]}\`に入っていません`);
  const channel = await guild.channels.fetch(id[1]).catch(() => null);
  if (!channel?.isTextBased())
    throw new URIError(
      `チャンネルID:\`${id[1]}\`が存在しないもしくはアクセスできません`,
    );
  const message = await channel.messages.fetch(id[2]).catch(() => {});
  if (!message)
    throw new URIError(
      `メッセージID:\`${id[2]}\`が存在しないもしくはアクセスできません`,
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
