import { type EmojiColors, getColorEmoji } from '@const/emojis';
import { bold, inlineCode, time } from 'discord.js';
import type {
  Channel,
  DMChannel,
  PartialDMChannel,
  PartialGroupDMChannel,
  User,
} from 'discord.js';
import { formatEmoji } from './util';

interface UserFieldOption {
  color: EmojiColors<'member'>;
  label: string;
}

interface textFieldOption {
  color: EmojiColors<'text'>;
  label: string;
}

interface scheduleFieldOption {
  color: EmojiColors<'schedule'>;
  label: string;
}

interface channelFieldOption {
  color: EmojiColors<'channel'>;
  label: string;
}

export function userField(user: User, options?: Partial<UserFieldOption>) {
  const option: UserFieldOption = {
    label: 'ユーザー',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('member', option.color))} ${bold(
    `${option.label}:`,
  )} ${user.toString()} [${inlineCode(user.tag)}]`;
}

export function textField(text: string, options?: Partial<textFieldOption>) {
  const option: textFieldOption = {
    label: 'ユーザー',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('text', option.color))} ${bold(
    `${option.label}:`,
  )} ${text}`;
}

export function scheduleField(
  date: Date | number,
  options?: Partial<scheduleFieldOption>,
) {
  const d = typeof date === 'number' ? new Date(date) : date;
  const option: scheduleFieldOption = {
    label: '時間',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('schedule', option.color))} ${bold(
    `${option.label}:`,
  )} ${time(d)}`;
}

export function channelField(
  channel: Exclude<
    Channel,
    DMChannel | PartialDMChannel | PartialGroupDMChannel
  >,
  options?: Partial<channelFieldOption>,
) {
  const option: channelFieldOption = {
    label: 'チャンネル',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('channel', option.color))} ${bold(
    `${option.label}:`,
  )} ${channel.toString()} [${inlineCode(channel.name)}]`;
}
