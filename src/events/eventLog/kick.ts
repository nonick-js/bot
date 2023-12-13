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
import type { GuildAuditLogsEntry, User } from 'discord.js';
import { langs } from 'lang';

type StateType = 'add';
type State<T extends StateType> = {
  type: T;
  executor: User;
  target: User;
  reason: string | null;
};
const stateColor: Record<StateType, number> = {
  add: Colors.Orange,
};

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    const state = await getState(auditLog);
    if (!state) return;
    const { kick: setting } =
      (await EventLogSetting.findOne({ serverId: guild.id })) ?? {};
    if (!setting?.enable) return;
    const channel = await guild.channels.fetch(setting.channel);
    await setLang(guild.id);
    if (channel instanceof TextChannel) {
      channel.send({
        embeds: [createEmbed(state)],
      });
    }
  },
});

async function getState(
  auditLog: GuildAuditLogsEntry,
): Promise<State<StateType> | undefined> {
  const executor = await auditLog.executor?.fetch();
  if (isKickAuditLog(auditLog) && executor && auditLog.target) {
    return {
      type: 'add',
      executor,
      target: auditLog.target,
      reason: auditLog.reason,
    };
  }
}

function isKickAuditLog(
  auditLog: GuildAuditLogsEntry,
): auditLog is GuildAuditLogsEntry<AuditLogEvent.MemberKick> {
  return auditLog.action === AuditLogEvent.MemberKick;
}

function createEmbed(state: State<StateType>) {
  return new EmbedBuilder()
    .setTitle(langs.tl('eventLog.kick.title'))
    .setDescription(
      [
        langs.tl('fields.member', state.target, 'label.target'),
        '',
        langs.tl('fields.executor', state.executor),
        langs.tl('fields.reason', state.reason ?? 'label.noReason'),
      ].join('\n'),
    )
    .setColor(stateColor[state.type])
    .setThumbnail(state.target.displayAvatarURL())
    .setTimestamp();
}
