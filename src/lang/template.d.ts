import type { Channel, ChannelType, DMChannel, User } from 'discord.js';

export type LangTemplate = {
  'eventLog.voice.join.title': [];
  'eventLog.voice.leave.title': [];
  'eventLog.voice.move.title': [];
  'eventLog.voice.move.old': [];
  'eventLog.voice.move.new': [];

  'eventLog.ban.add.title': [];
  'eventLog.ban.remove.title': [];

  'eventLog.kick.title': [];

  'eventLog.messageDelete.title': [];

  'eventLog.messageEdit.title': [];

  'eventLog.timeout.add.title': [];
  'eventLog.timeout.remove.title': [];

  'message.expansion.title': [];

  'automation.publishAnnounce.failed': [];

  'label.target': [];
  'label.member': [];
  'label.channel': [];
  'label.schedule': [];
  'label.timeoutSchedule': [];
  'label.sender': [];
  'label.sendAt': [];
  'label.deleteBy': [];
  'label.message': [];
  'label.sticker': [];
  'label.before': [];
  'label.after': [];
  'label.none': [];
  'label.executor': [];
  'label.reason': [];
  'label.noReason': [];
  'label.newThread': [];

  'fields.member': [user: User, label?: keyof LangTemplate];
  'fields.channel': [
    channel: Exclude<Channel, { type: ChannelType.DM | ChannelType.GroupDM }>,
    label?: keyof LangTemplate,
  ];
  'fields.schedule': [date: Date, label?: keyof LangTemplate];
  'fields.executor': [user: User, label?: keyof LangTemplate];
  'fields.reason': [
    reason: keyof LangTemplate | string,
    label?: keyof LangTemplate,
  ];
};
