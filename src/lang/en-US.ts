import { blurple, gray, guildFeatures, white } from '@const/emojis';
import { Duration } from '@modules/format';
import type { LangData } from '@modules/translate';
import { formatEmoji } from '@modules/utils';
import { bold, escapeMarkdown, inlineCode, time } from 'discord.js';
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
  'commands.reload.description': () => 'Reboot this BOT',
  'commands.status.description': () => 'Display BOT status',
  'commands.bulkdelete.description': () =>
    'Batch delete messages sent to this channel in the latest order (up to 2 weeks ago)',
  'commands.firstmessage.description': () =>
    'Send the URL button of the first message posted on the channel',
  'commands.ratelimit.description': () => 'Set Slowmode for this channel',
  'commands.timeout.description': () => 'Timeout users (more flexible)',
  'commands.pauseinvite.description': () => 'Toggle server invite pause state',
  'commands.info.description': () => 'Display user/server information',

  'commands.bulkdelete.messages.description': () =>
    'Number of messages to delete',
  'commands.firstmessage.context.description': () => 'Message',
  'commands.firstmessage.label.description': () => 'Button Label',
  'commands.ratelimit.duration.description': () => 'seconds',
  'commands.timeout.user.description': () => 'User',
  'commands.timeout.date.description': () => 'Date',
  'commands.timeout.hour.description': () => 'Hours',
  'commands.timeout.minute.description': () => 'Minutes',
  'commands.timeout.reason.description': () => 'Reason',
  'commands.pauseinvite.pause.description': () => 'Whether to pause',
  'commands.info.user.description': () => 'Display user information',
  'commands.info.user.user.description': () => 'User',
  'commands.info.server.description': () => 'Display server information',
  'commands.verify.description': () =>
    'Create a verification panel using roles',
  'commands.verify.type.description': () => 'Verification Type',
  'commands.verify.type.button': () => 'Button',
  'commands.verify.type.image': () => 'Image',
  'commands.verify.role.description': () =>
    'Roles assigned on successful verification',
  'commands.verify.description.description': () =>
    'Embed description (line break with two spaces)',
  'commands.verify.color.description': () => 'Embed color',

  'contexts.infouser.name': () => 'User information',

  'label.target': () => 'Target',
  'label.channel': () => 'Channel',
  'label.executor': () => 'Executor',
  'label.member': () => 'Member',
  'label.schedule': () => 'Schedule',
  'label.timeoutSchedule': () => 'Timeout Remove Date',
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
  'label.notPermitted': () => 'Not Permitted',
  'label.notCommandPermission': () =>
    'You do not have permission to execute commands',
  'label.notEnoughBotPermission': () => 'not enough BOT permissions',
  'label.status': () => 'Status',
  'label.roles': () => 'Roles',
  'label.serverId': () => 'Server Id',
  'label.owner': () => 'Owner',
  'label.memberCount': () => 'Member count',
  'label.channelCount': () => 'Channel count',
  'label.serverCreateAt': () => 'Server creation date',
  'label.boostCount': () => 'Boost count',
  'label.userId': () => 'User Id',
  'label.nickname': () => 'Nickname',
  'label.notMember': () => 'This user is not on this server',
  'label.accountCreateAt': () => 'Account creation date',
  'label.badges': () => 'Badges',
  'label.serverJoinAt': () => 'Server Join Date',
  'label.error': () => 'Error',
  'label.boostSince': () => 'Boost Start Date',
  'label.color.red': () => '🔴Red',
  'label.color.orange': () => '🟠Orange',
  'label.color.yellow': () => '🟡Yellow',
  'label.color.green': () => '🟢Green',
  'label.color.blue': () => '🔵Blue',
  'label.color.purple': () => '🟣Purple',
  'label.color.white': () => '⚪White',
  'label.color.black': () => '⚫Black',
  'label.verify': () => 'Verify',

  'label.bulkdelete.failed': () =>
    `${inlineCode('❌')} Failed to delete message`,
  'label.bulkdelete.success': (count) =>
    `${inlineCode('✅')} ${inlineCode(count.toString())} messages deleted`,
  'label.firstmessage.failed': () =>
    `${inlineCode('❌')} Could not retrieve message`,
  'label.ratelimit.failed': () => `${inlineCode('❌')} Failed to set Slowmode`,
  'label.ratelimit.success': (duration) =>
    `${inlineCode('✅')} Set Channel Slowmode to ${inlineCode(
      `${duration} seconds`,
    )}`,
  'label.timeout.failed.notExistsMember': () =>
    `${inlineCode('❌')} This user is not on the server`,
  'label.timeout.failed.notEnoughTime': () =>
    `${inlineCode('❌')} Total time can be set from 1 minute and up`,
  'label.timeout.failed.timeTooMany': () =>
    `${inlineCode('❌')} Cannot time out for more than 28 days`,
  'label.timeout.failed.yourself': () =>
    `${inlineCode('❌')} Can't target yourself`,
  'label.timeout.failed.notPermittedTimeout': () =>
    `${inlineCode('❌')} You do not have permission to time out this user`,
  'label.timeout.failed': () => `${inlineCode('❌')} Timeout failed`,
  'label.timeout.success': (member, duration) =>
    `${inlineCode('✅')} Timeout ${member} ${Duration.format(
      duration,
      `${bold('%{d}')} days, ${bold('%{h}')} hours, ${bold('%{m}')} minutes`,
    )}`,
  'label.pauseinvite.failed.alreadyDone': () =>
    `${inlineCode('❌')} Already in that state`,
  'label.pauseinvite.failed': () =>
    `${inlineCode('❌')} Failed to change invite pause state`,
  'label.pauseinvite.success': (state) =>
    `${inlineCode('✅')} Server invite ${langs.tl(state)}`,
  'label.verify.failed.unusableRole': () =>
    `${inlineCode('❌')} The role cannot be used for verification`,
  'label.verify.failed.higherRole': () =>
    `${inlineCode(
      '❌',
    )} The role above the one you have cannot be used for verification`,
  'label.verify.failed.botHigherRole': () =>
    `${inlineCode(
      '❌',
    )} The role above the one the bot has cannot be used for verification`,
  'label.verify.failed.inProgress': () =>
    `${inlineCode(
      '❌',
    )} Another verification is currently underway. A new verification cannot be performed until the verification is completed`,
  'label.verify.failed.alreadyDone': () =>
    `${inlineCode('✅')} It has already been verified`,
  'label.verify.failed.grantRole': () =>
    `${inlineCode(
      '❌',
    )} Could not grant role. Please contact your server administrator`,
  'label.verify.failed.sendDM': () =>
    `${inlineCode(
      '❌',
    )} To perform this verification, you must be set up to receive DMs from the BOT`,
  'label.verify.failed.tryCountsExceeded': () =>
    `${inlineCode(
      '❌',
    )} Verification failed after exceeding the number of attempts. Next verification will be available in ${inlineCode(
      '5 minutes',
    )}.`,
  'label.verify.failed': () =>
    `${inlineCode('❌')} A problem occurred during verification`,
  'label.verify.success': () => `${inlineCode('✅')} Successfully verified!`,
  'label.verify.giveRole': () => 'Roles to be granted',
  'label.verify.image.description': () =>
    [
      'Please send the green string of text shown in the image below to this DM',
      '> ⚠️After a certain amount of time or if you make a mistake more than once, you will need to issue a new certification',
    ].join('\n'),
  'label.verify.image.footer': () =>
    'NoNICK.js never requests you to enter a password or read a QR code',
  'label.verify.image': () => 'Image verification',
  'label.verify.inductionDM': () =>
    `${inlineCode('📨')} Please continue to verify with DM`,

  'label.permission.manageMessages': () => 'Manage Messages',
  'label.permission.manageChannels': () => 'Manage Channels',
  'label.permission.manageRoles': () => 'Manage Roles',

  'label.guildFeature.PARTNERED': () => 'Discord Partner',
  'label.guildFeature.VERIFIED': () => 'Verified',
  'label.guildFeature.DISCOVERABLE': () => 'Discoverable Community Server',

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

  'label.firstmessage.default': () => 'Go to top',
  'label.pauseinvite.enable': () => 'enabled',
  'label.pauseinvite.pause': () => 'paused',
  'label.pauseinvite.reason.pause': (user) => `Pause invites - ${user.tag}`,
  'label.pauseinvite.reason.enable': (user) => `Enable invites - ${user.tag}`,

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

  'field.notPermitted': (label, ...permissions) =>
    `${inlineCode('❌')} ${langs.tl(label ?? 'label.notPermitted')}${
      permissions?.length
        ? `: ${permissions.map((p) => langs.tl(p)).join(', ')}`
        : ''
    }`,

  'field.id': (id, label) =>
    `${formatEmoji(white.id)} ${langs.tl(
      label ?? 'label.serverId',
    )}: ${inlineCode(id)}`,
  'field.owner': (owner, label) =>
    `${formatEmoji(white.nickName)} ${langs.tl(
      label ?? 'label.owner',
    )}: ${owner.toString()}`,
  'field.memberCount': (count, label) =>
    `${formatEmoji(white.nickName)} ${langs.tl(
      label ?? 'label.memberCount',
    )}: ${inlineCode(count.toString())}`,
  'field.channelCount': (count, label) =>
    `${formatEmoji(white.channel)} ${langs.tl(
      label ?? 'label.channelCount',
    )}: ${inlineCode(count.toString())}`,
  'field.createAt': (date, label) =>
    `${formatEmoji(white.schedule)} ${langs.tl(
      label ?? 'label.serverCreateAt',
    )}: ${time(date, 'D')}`,
  'field.boostCount': (count, label) =>
    `${formatEmoji(white.boost)} ${langs.tl(
      label ?? 'label.boostCount',
    )}: ${inlineCode(count.toString())}`,

  'field.guildFeature': (type, label) =>
    `${
      guildFeatures[type] ? formatEmoji(guildFeatures[type] as string) : ''
    }${langs.tl(label ?? `label.guildFeature.${type}`)}`,

  'field.nickname': (member, label) =>
    `${formatEmoji(white.nickName)} ${langs.tl(
      label ?? 'label.nickname',
    )}: ${bold(escapeMarkdown(member.nickname ?? langs.tl('label.none')))}`,
  'field.verify': (type, label) =>
    `${inlineCode('✅')} ${langs.tl(label ?? 'label.verify')}: ${langs.tl(
      type,
    )}`,
};
