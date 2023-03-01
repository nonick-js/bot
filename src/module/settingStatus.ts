import { ButtonStyle, channelMention, formatEmoji, roleMention } from 'discord.js';
import { GrayEmojies } from './emojies';

const StatusEmoji = {
  enable: '1076014905922170900',
  disable: '1076014910686908467',
  sync: '1076014908946268191',
};

export function booleanStatus(boolean?: boolean): string {
  return boolean ? `${formatEmoji(StatusEmoji.enable)} **状態:** 有効` : `${formatEmoji(StatusEmoji.disable)} **状態:** 無効`;
}

export function channelStatus(channel?: (string | null)): string {
  return `${formatEmoji(GrayEmojies.channel)} **チャンネル:** ${channel ? channelMention(channel) : '未設定'}`;
}

export function roleStatus(role?: (string | null)): string {
  return `${formatEmoji(GrayEmojies.member)} **ロール:** ${role ? roleMention(role) : '未設定'}`;
}

export function buttonLabelStatus(enable?: boolean): string {
  return enable ? '無効化' : '有効化';
}

export function buttonStyleStatus(enable?: boolean): number {
  return enable ? ButtonStyle.Danger : ButtonStyle.Success;
}