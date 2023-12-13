import { EventLogSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { setLang } from '@modules/utils';
import {
  AuditLogEvent,
  Colors,
  EmbedBuilder,
  Events,
  TextChannel,
} from 'discord.js';
import type { Guild, GuildAuditLogsEntry, GuildMember, User } from 'discord.js';
import { langs } from 'lang';

type StateType = 'add' | 'remove';
type State<T extends StateType> = {
  type: T;
  executor: User;
  target: GuildMember;
  time: Date | null;
  reason: string | null;
};
const stateColor: Record<StateType, number> = {
  add: Colors.Red,
  remove: Colors.Blue,
};

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    const state = await getState(auditLog, guild);
    if (!state) return;
    const { timeout: setting } =
      (await EventLogSetting.findOne({ serverId: guild.id })) ?? {};
    if (!setting?.enable) return;
    const channel = await guild.channels.fetch(setting.channel);
    await setLang(guild.id);
    if (channel instanceof TextChannel) {
      channel.send({ embeds: [createEmbed(state)] });
    }
  },
});

async function getState(
  auditLog: GuildAuditLogsEntry,
  guild: Guild,
): Promise<State<StateType> | undefined> {
  const executor = await auditLog.executor?.fetch();
  const time = auditLog.changes.find(
    (v) => v.key === 'communication_disabled_until',
  );
  if (isBanAuditLog(auditLog) && executor && auditLog.target && time) {
    const target = await guild.members.fetch(auditLog.target.id);
    return {
      type: Date.parse(time.new as string) > Date.now() ? 'add' : 'remove',
      executor,
      target,
      time: target.communicationDisabledUntil,
      reason: auditLog.reason,
    };
  }
}

function isBanAuditLog(
  auditLog: GuildAuditLogsEntry,
): auditLog is GuildAuditLogsEntry<AuditLogEvent.MemberUpdate> {
  return auditLog.action === AuditLogEvent.MemberUpdate;
}

function createEmbed(state: State<StateType>) {
  return new EmbedBuilder()
    .setTitle(langs.tl(`eventLog.timeout.${state.type}.title`))
    .setDescription(createField(state))
    .setColor(stateColor[state.type])
    .setThumbnail(state.target.displayAvatarURL())
    .setTimestamp();
}

function createField(state: State<StateType>) {
  const field = [
    langs.tl('fields.member', state.target.user, 'label.target'),
    '',
    langs.tl('fields.executor', state.executor),
    langs.tl('fields.reason', state.reason ?? 'label.noReason'),
  ];
  if (state.type === 'add' && state.time)
    field.splice(
      1,
      0,
      langs.tl('fields.schedule', state.time, 'label.timeoutSchedule'),
    );
  return field.join('\n');
}
