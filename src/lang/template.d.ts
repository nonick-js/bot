import type {
  Channel,
  ChannelType,
  DMChannel,
  GuildFeature,
  GuildMember,
  User,
} from 'discord.js';

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
  'commands.reload.description': [];
  'commands.status.description': [];
  'commands.bulkdelete.description': [];
  'commands.firstmessage.description': [];
  'commands.ratelimit.description': [];
  'commands.timeout.description': [];
  'commands.pauseinvite.description': [];
  'commands.info.description': [];

  'commands.bulkdelete.messages.description': [];
  'commands.firstmessage.context.description': [];
  'commands.firstmessage.label.description': [];
  'commands.ratelimit.duration.description': [];
  'commands.timeout.user.description': [];
  'commands.timeout.date.description': [];
  'commands.timeout.hour.description': [];
  'commands.timeout.minute.description': [];
  'commands.timeout.reason.description': [];
  'commands.pauseinvite.pause.description': [];
  'commands.info.user.description': [];
  'commands.info.user.user.description': [];
  'commands.info.server.description': [];
  'commands.verify.description': [];
  'commands.verify.type.description': [];
  'commands.verify.role.description': [];
  'commands.verify.description.description': [];
  'commands.verify.color.description': [];
  'commands.verify.type.button': [];
  'commands.verify.type.image': [];

  'contexts.infouser.name': [];

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
  'label.notPermitted': [];
  'label.notCommandPermission': [];
  'label.notEnoughBotPermission': [];
  'label.status': [];
  'label.roles': [];
  'label.serverId': [];
  'label.owner': [];
  'label.memberCount': [];
  'label.channelCount': [];
  'label.serverCreateAt': [];
  'label.boostCount': [];
  'label.userId': [];
  'label.nickname': [];
  'label.notMember': [];
  'label.accountCreateAt': [];
  'label.badges': [];
  'label.serverJoinAt': [];
  'label.error': [];
  'label.boostSince': [];
  'label.color.red': [];
  'label.color.orange': [];
  'label.color.yellow': [];
  'label.color.green': [];
  'label.color.blue': [];
  'label.color.purple': [];
  'label.color.white': [];
  'label.color.black': [];
  'label.verify': [];

  'label.bulkdelete.failed': [];
  'label.bulkdelete.success': [count: number];
  'label.firstmessage.failed': [];
  'label.ratelimit.failed': [];
  'label.ratelimit.success': [duration: number];
  'label.timeout.failed.notExistsMember': [];
  'label.timeout.failed.notEnoughTime': [];
  'label.timeout.failed.timeTooMany': [];
  'label.timeout.failed.yourself': [];
  'label.timeout.failed.notPermittedTimeout': [];
  'label.timeout.failed': [];
  'label.timeout.success': [member: GuildMember, duration: number];
  'label.pauseinvite.failed.alreadyDone': [];
  'label.pauseinvite.failed': [];
  'label.pauseinvite.success': [state: keyof LangTemplate];
  'label.verify.failed.unusableRole': [];
  'label.verify.failed.higherRole': [];
  'label.verify.failed.botHigherRole': [];
  'label.verify.failed.inProgress': [];
  'label.verify.failed.alreadyDone': [];
  'label.verify.failed.grantRole': [];
  'label.verify.failed.sendDM': [];
  'label.verify.failed.tryCountsExceeded': [];
  'label.verify.failed': [];
  'label.verify.success': [];
  'label.verify.giveRole': [];
  'label.verify.image.description': [];
  'label.verify.image.footer': [];
  'label.verify.image': [];
  'label.verify.inductionDM': [];

  'label.permission.manageMessages': [];
  'label.permission.manageChannels': [];
  'label.permission.manageRoles': [];

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

  'label.firstmessage.default': [];
  'label.pauseinvite.pause': [];
  'label.pauseinvite.enable': [];
  'label.pauseinvite.reason.pause': [user: User];
  'label.pauseinvite.reason.enable': [user: User];

  'label.guildFeature.PARTNERED': [];
  'label.guildFeature.VERIFIED': [];
  'label.guildFeature.DISCOVERABLE': [];

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
  'field.notPermitted': [
    label?: keyof LangTemplate,
    ...permissions: (keyof LangTemplate)[],
  ];
  'field.id': [id: string, label?: keyof LangTemplate];
  'field.owner': [owner: GuildMember, label?: keyof LangTemplate];
  'field.memberCount': [count: number, label?: keyof LangTemplate];
  'field.channelCount': [count: number, label?: keyof LangTemplate];
  'field.createAt': [date: Date, label?: keyof LangTemplate];
  'field.boostCount': [count: number, label?: keyof LangTemplate];

  'field.guildFeature': [type: GuildFeature, label: keyof LangTemplate];

  'field.nickname': [name: GuildMember, label?: keyof LangTemplate];
  'field.verify': [type: keyof LangTemplate, label?: keyof LangTemplate];
};
