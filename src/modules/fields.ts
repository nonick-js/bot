import { type EmojiColors, getColorEmoji, gray } from '@const/emojis';
import { type User, bold, escapeMarkdown, inlineCode, time } from 'discord.js';
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

export function userField(user: User, options?: Partial<UserFieldOption>) {
  const option: UserFieldOption = {
    label: 'ユーザー',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('member', option.color))} ${bold(
    `${option.label}:`,
  )} ${user.toString()} [${inlineCode(escapeMarkdown(user.tag))}]`;
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
