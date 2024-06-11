import { type EmojiColors, getColorEmoji } from '@const/emojis';
import { PermissionsBitField, bold, inlineCode, time } from 'discord.js';
import type {
  Channel,
  DMChannel,
  PartialDMChannel,
  PartialGroupDMChannel,
  PermissionResolvable,
  User,
} from 'discord.js';
import { formatEmoji } from './util';

interface UserFieldOption {
  color: EmojiColors<'member'>;
  label: string;
}

interface TextFieldOption {
  color: EmojiColors<'text'>;
  label: string;
}

interface ScheduleFieldOption {
  color: EmojiColors<'schedule'>;
  label: string;
}

interface ChannelFieldOption {
  color: EmojiColors<'channel'>;
  label: string;
}

interface PermissionFieldOption {
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

export function textField(text: string, options?: Partial<TextFieldOption>) {
  const option: TextFieldOption = {
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
  options?: Partial<ScheduleFieldOption>,
) {
  const d = typeof date === 'number' ? new Date(date) : date;
  const option: ScheduleFieldOption = {
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
  options?: Partial<ChannelFieldOption>,
) {
  const option: ChannelFieldOption = {
    label: 'チャンネル',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('channel', option.color))} ${bold(
    `${option.label}:`,
  )} ${channel.toString()} [${inlineCode(channel.name)}]`;
}

export function permissionField(
  permissions: string[],
  options?: PermissionFieldOption,
) {
  const option: PermissionFieldOption = {
    label: '権限がありません',
    ...options,
  };
  return `${inlineCode('❌')} ${bold(`${option.label}`)}${
    permissions.length ? `${bold(':')} ${permissions.join('\n')}` : ''
  }`;
}
