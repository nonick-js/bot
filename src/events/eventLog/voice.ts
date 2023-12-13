import { EventLogSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { setLang } from '@modules/utils';
import { Colors, EmbedBuilder, Events, TextChannel } from 'discord.js';
import type { GuildMember, VoiceBasedChannel, VoiceState } from 'discord.js';
import { langs } from 'lang';

type StateType = 'join' | 'leave' | 'move';
type State<T extends StateType> = T extends 'move'
  ? {
      type: T;
      oldChannel: VoiceBasedChannel;
      newChannel: VoiceBasedChannel;
      member: GuildMember;
    }
  : { type: T; channel: VoiceBasedChannel; member: GuildMember };
const stateColor: Record<StateType, number> = {
  join: Colors.Green,
  leave: Colors.Red,
  move: Colors.Yellow,
};

export default new DiscordEventBuilder({
  type: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const state = getState(oldState, newState);
    if (!state) return;
    const { voice: setting } =
      (await EventLogSetting.findOne({ serverId: oldState.guild.id })) ?? {};
    if (!setting?.enable) return;
    const channel = await oldState.guild.channels.fetch(setting.channel);
    await setLang(oldState.guild.id);
    if (channel instanceof TextChannel) {
      channel.send({ embeds: [createEmbed(state)] });
    }
  },
});

function getState(
  { channel: oldChannel, member: oldMember }: VoiceState,
  { channel: newChannel, member: newMember }: VoiceState,
): State<StateType> | undefined {
  if (!oldChannel && newChannel && newMember)
    return {
      type: 'join',
      channel: newChannel,
      member: newMember,
    };
  if (!newChannel && oldChannel && oldMember)
    return {
      type: 'leave',
      channel: oldChannel,
      member: oldMember,
    };
  if (oldChannel && newChannel && oldChannel.id !== newChannel.id && oldMember)
    return {
      type: 'move',
      oldChannel,
      newChannel,
      member: oldMember,
    };
}

function createEmbed(state: State<StateType>) {
  return new EmbedBuilder()
    .setTitle(langs.tl(`eventLog.voice.${state.type}.title`))
    .setDescription(createField(state))
    .setThumbnail(state.member.displayAvatarURL())
    .setColor(stateColor[state.type])
    .setTimestamp();
}

function createField(state: State<StateType>) {
  const field = [langs.tl('fields.member', state.member.user)];
  if (state.type === 'move') {
    field.push(
      langs.tl('fields.channel', state.oldChannel, 'eventLog.voice.move.old'),
      langs.tl('fields.channel', state.newChannel, 'eventLog.voice.move.new'),
    );
  } else {
    field.push(langs.tl('fields.channel', state.channel));
  }
  return field.join('\n');
}
