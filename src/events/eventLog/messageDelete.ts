import { EventLogSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Duration } from '@modules/format';
import { setLang } from '@modules/utils';
import AdmZip from 'adm-zip';
import axios from 'axios';
import {
  AttachmentBuilder,
  AuditLogEvent,
  Collection,
  Colors,
  EmbedBuilder,
  Events,
  TextChannel,
} from 'discord.js';
import type {
  GuildAuditLogsEntry,
  Message,
  PartialMessage,
  User,
} from 'discord.js';
import { langs } from 'lang';

type StateType = 'delete';
type State<T extends StateType> = {
  type: T;
  message: Message<true>;
  executor: User | null;
  beforeMessage: Message<true> | null;
};
const stateColor: Record<StateType, number> = {
  delete: Colors.White,
};

const lastAuditLog = new Collection<
  string,
  GuildAuditLogsEntry<AuditLogEvent.MessageDelete>
>();

export default new DiscordEventBuilder({
  type: Events.MessageDelete,
  async execute(message) {
    const state = await getState(message);
    if (!state) return;
    const { messageDelete: setting } =
      (await EventLogSetting.findOne({ serverId: state.message.guild.id })) ??
      {};
    if (!setting?.enable) return;
    const channel = await state.message.guild.channels.fetch(setting.channel);
    await setLang(state.message.guild.id);
    if (channel instanceof TextChannel) {
      channel.send(await createMessageOption(state));
    }
  },
});

async function getState(
  message: Message | PartialMessage,
): Promise<State<StateType> | undefined> {
  if (!message.inGuild()) return;
  const log = await getAuditLog(message);
  const executor = (await log?.executor?.fetch()) ?? null;
  const beforeMessage =
    (await message.channel.messages
      .fetch({ before: message.id, limit: 1 })
      .then((v) => v.first())) ?? null;
  return {
    type: 'delete',
    message,
    beforeMessage,
    executor,
  };
}

async function getAuditLog(message: Message<true>) {
  const entry = await message.guild
    .fetchAuditLogs({
      type: AuditLogEvent.MessageDelete,
      limit: 3,
    })
    .then((v) =>
      v.entries.find(
        (e) =>
          e.target.equals(message.author) &&
          e.extra.channel.id === message.channel.id &&
          Date.now() - e.createdTimestamp < Duration.toMS('1m'),
      ),
    );
  const lastLog = lastAuditLog.get(message.guild.id);
  if (
    entry &&
    !(lastLog?.id === entry.id && lastLog.extra.count >= entry.extra.count)
  ) {
    lastAuditLog.set(message.guild.id, entry);
    return entry;
  }
}

async function createMessageOption(state: State<StateType>) {
  const embed = new EmbedBuilder()
    .setTitle(langs.tl('eventLog.messageDelete.title'))
    .setURL(state.beforeMessage?.url ?? null)
    .setDescription(
      [
        langs.tl('fields.channel', state.message.channel),
        langs.tl('fields.member', state.message.author, 'label.sender'),
        langs.tl(
          'fields.member',
          state.executor ?? state.message.author,
          'label.deleteBy',
        ),
        langs.tl('fields.schedule', state.message.createdAt, 'label.sendAt'),
      ].join('\n'),
    )
    .setColor(stateColor[state.type])
    .setThumbnail(state.message.author.displayAvatarURL())
    .setFields({
      name: langs.tl('label.message'),
      value: state.message.content || langs.tl('label.none'),
    });
  if (state.message.stickers.size) {
    embed.addFields({
      name: langs.tl('label.sticker'),
      value: state.message.stickers.map((v) => v.name).join('\n'),
    });
  }
  const attachment = await createAttachment(state);
  if (attachment) return { embeds: [embed], files: [attachment] };
  return { embeds: [embed] };
}

async function createAttachment(state: State<StateType>) {
  if (!state.message.attachments.size) return;
  const zip = new AdmZip();
  for await (const attachment of state.message.attachments.values()) {
    const res = await axios
      .get(attachment.url, { responseType: 'arraybuffer' })
      .catch(() => null);
    if (!res) continue;
    zip.addFile(attachment.name, res.data);
  }
  return new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
}
