import { blurple, gray } from '@const/emojis';
import type { LangData } from '@modules/translate';
import {
  bold,
  escapeMarkdown,
  formatEmoji,
  inlineCode,
  time,
} from 'discord.js';
import { langs } from 'lang';
import type { LangTemplate } from './template';

export const en_US: Required<LangData<LangTemplate>> = {
  'eventLog.voice.join.title': () => 'Join Channel',
  'eventLog.voice.leave.title': () => 'Leave Channel',
  'eventLog.voice.move.title': () => 'Move Channel',
  'eventLog.voice.move.old': () => 'Old Channel',
  'eventLog.voice.move.new': () => 'New Channel',

  'eventLog.ban.add.title': () => `${inlineCode('🔨')} BAN`,
  'eventLog.ban.remove.title': () => `${inlineCode('🔨')} Unban`,

  'eventLog.kick.title': () => `${inlineCode('🔨')} Kick`,

  'eventLog.timeout.add.title': () => `${inlineCode('🛑')} Timeout`,
  'eventLog.timeout.remove.title': () => `${inlineCode('🛑')} Remove Timeout`,

  'eventLog.messageDelete.title': () => `${inlineCode('💬')} Delete Message`,

  'eventLog.messageEdit.title': () => `${inlineCode('💬')} Edit Message`,

  'message.expansion.title': () => 'Message Expansion',

  'automation.publishAnnounce.failed': () =>
    `${inlineCode('❌')} Failed to publish message`,

  'automation.memberVerify.title': (level) =>
    `${inlineCode('✅')} Auto change verify level - ${bold(langs.tl(level))}`,

  'commands.help.description': () => 'About this BOT',

  'label.target': () => 'Target',
  'label.channel': () => 'Channel',
  'label.executor': () => 'Executor',
  'label.member': () => 'Member',
  'label.schedule': () => 'Schedule',
  'label.timeoutSchedule': () => 'Release Schedule',
  'label.sender': () => 'Sender',
  'label.sendAt': () => 'Sending Time',
  'label.deleteBy': () => 'Delete by',
  'label.message': () => 'Message',
  'label.sticker': () => 'Sticker',
  'label.before': () => 'Before',
  'label.after': () => 'After',
  'label.none': () => 'None',
  'label.reason': () => 'Reason',
  'label.noReason': () => 'No reason entered',
  'label.newThread': () => 'New Thread',
  'label.start': () => 'Start',
  'label.end': () => 'End',
  'label.changeVerify': (level) =>
    `Server verification level has been changed to **${langs.tl(level)}**`,
  'label.rule': () => 'Rule',
  'label.supportServer': () => 'Support server',
  'label.documents': () => 'Documents (ja)',
  'label.aboutBot.0': () => 'Features to help manage and grow the server!',
  'label.aboutBot.1': () =>
    'Daily developing to be "completely free and useful multifunctional BOT"',
  'label.developer': (developer) => `Developer: ${developer}`,
  'label.commandHasCoolTime': () =>
    `${inlineCode('⌛')} Command is on cooldown`,

  'label.verifyLevel.0.name': () => 'None',
  'label.verifyLevel.0.description': () => 'Unlimited',
  'label.verifyLevel.1.name': () => 'Low',
  'label.verifyLevel.1.description': () =>
    'Must have a verified email on their Discord Account',
  'label.verifyLevel.2.name': () => 'Medium',
  'label.verifyLevel.2.description': () =>
    'Must also be registered on Discord for longer than 5 minutes',
  'label.verifyLevel.3.name': () => 'High',
  'label.verifyLevel.3.description': () =>
    'Must also be a member of this server for longer than 10 minutes',
  'label.verifyLevel.4.name': () => 'Highest',
  'label.verifyLevel.4.description': () =>
    'Must have a verified phone aon their Discord account',

  'label.autoMod.rule.inviteUrl': () => 'Invite URL',
  'label.autoMod.rule.token': () => 'Token',
  'label.autoMod.rule.domain': () => 'Banned Domains',

  'fields.member': (user, label) =>
    `${formatEmoji(gray.member)} ${bold(
      `${langs.tl(label ?? 'label.member')}:`,
    )} ${user.toString()} [${escapeMarkdown(user.tag)}]`,
  'fields.channel': (channel, label) =>
    `${formatEmoji(gray.channel)} ${bold(
      `${langs.tl(label ?? 'label.channel')}:`,
    )} ${channel.toString()} [${escapeMarkdown(channel.name)}]`,

  'fields.schedule': (date, label) =>
    `${formatEmoji(gray.schedule)} ${bold(
      `${langs.tl(label ?? 'label.schedule')}:`,
    )} ${time(date, 'f')} (${time(date, 'R')})`,

  'fields.executor': (user, label) =>
    `${formatEmoji(blurple.member)} ${bold(
      `${langs.tl(label ?? 'label.executor')}:`,
    )} ${user.toString()} [${escapeMarkdown(user.tag)}]`,

  'fields.reason': (reason, label) =>
    `${formatEmoji(blurple.text)} ${bold(
      `${langs.tl(label ?? 'label.reason')}:`,
    )} ${langs.tl(reason ?? 'label.noReason')}`,
};
