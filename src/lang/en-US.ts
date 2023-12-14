import type { LangData } from '@modules/translate';
import { inlineCode } from 'discord.js';
import type { LangTemplate } from './template';

export const en_US: LangData<LangTemplate> = {
  'eventLog.voice.join.title': () => 'Join Channel',
  'eventLog.voice.leave.title': () => 'Leave Channel',
  'eventLog.voice.move.title': () => 'Move Channel',
  'eventLog.voice.move.old': () => 'Old Channel',
  'eventLog.voice.move.new': () => 'New Channel',

  'eventLog.ban.remove.title': () => `${inlineCode('🔨')} Unban`,

  'eventLog.timeout.add.title': () => `${inlineCode('🛑')} Timeout`,
  'eventLog.timeout.remove.title': () => `${inlineCode('🛑')} Remove Timeout`,

  'eventLog.messageDelete.title': () => `${inlineCode('💬')} Delete Message`,

  'eventLog.messageEdit.title': () => `${inlineCode('💬')} Edit Message`,

  'message.expansion.title': () => 'Message Expansion',

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
};
