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
  'automation.memberVerify.title': [label: keyof LangTemplate];

  'commands.help.description': [];

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
  'label.start': [];
  'label.end': [];
  'label.changeVerify': [level: keyof LangTemplate];
  'label.rule': [];
  'label.supportServer': [];
  'label.documents': [];
  'label.aboutBot.0': [];
  'label.aboutBot.1': [];
  'label.developer': [developer: string];
  'label.commandHasCoolTime': [];

  'label.verifyLevel.0.name': [];
  'label.verifyLevel.0.description': [];
  'label.verifyLevel.1.name': [];
  'label.verifyLevel.1.description': [];
  'label.verifyLevel.2.name': [];
  'label.verifyLevel.2.description': [];
  'label.verifyLevel.3.name': [];
  'label.verifyLevel.3.description': [];
  'label.verifyLevel.4.name': [];
  'label.verifyLevel.4.description': [];

  'label.autoMod.rule.inviteUrl': [];
  'label.autoMod.rule.token': [];
  'label.autoMod.rule.domain': [];

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
