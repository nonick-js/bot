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

type StateType = 'add' | 'remove';
type State<T extends StateType> = {
  type: T;
  executor: User;
  target: User;
  reason: string | null;
};
const stateColor: Record<StateType, number> = {
  add: Colors.Red,
  remove: Colors.Blue,
};

export default new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    const state = await getState(auditLog);
    if (!state) return;
    const { ban: setting } =
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
): Promise<State<StateType> | undefined> {
  const executor = await auditLog.executor?.fetch();
  if (isBanAuditLog(auditLog) && executor && auditLog.target) {
    return {
      type: auditLog.action === AuditLogEvent.MemberBanAdd ? 'add' : 'remove',
      executor,
      target: auditLog.target,
      reason: auditLog.reason,
    };
  }
}

function isBanAuditLog(
  auditLog: GuildAuditLogsEntry,
): auditLog is
  | GuildAuditLogsEntry<AuditLogEvent.MemberBanAdd>
  | GuildAuditLogsEntry<AuditLogEvent.MemberBanRemove> {
  return [AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberBanRemove].includes(
    auditLog.action,
  );
}

function createEmbed(state: State<StateType>) {
  return new EmbedBuilder()
    .setTitle(langs.tl(`eventLog.ban.${state.type}.title`))
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
