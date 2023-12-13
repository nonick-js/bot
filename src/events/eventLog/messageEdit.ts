import { EventLogSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { setLang } from '@modules/utils';
import AdmZip from 'adm-zip';
import axios from 'axios';
import {
  AttachmentBuilder,
  Colors,
  EmbedBuilder,
  Events,
  TextChannel,
} from 'discord.js';
import type {
  Attachment,
  Collection,
  Message,
  PartialMessage,
} from 'discord.js';
import { langs } from 'lang';

type StateType = 'edit' | 'deleteFile';
type State<T extends StateType> = T extends 'edit'
  ? {
      type: T;
      message: Message<true>;
      oldContent: string | null;
      newContent: string | null;
    }
  : {
      type: T;
      message: Message<true>;
      files: Collection<string, Attachment>;
    };
const stateColor: Record<StateType, number> = {
  edit: Colors.Yellow,
  deleteFile: Colors.Yellow,
};

export default new DiscordEventBuilder({
  type: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    const state = getState(oldMessage, newMessage);
    if (!state) return;
    const { messageEdit: setting } =
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

function getState(
  oldMessage: Message | PartialMessage,
  { content: newContent, attachments: newFiles }: Message | PartialMessage,
): State<StateType> | undefined {
  if (!oldMessage.inGuild()) return;
  if (oldMessage.content !== newContent)
    return {
      type: 'edit',
      message: oldMessage,
      oldContent: oldMessage.content,
      newContent,
    };
  if (oldMessage.attachments.size > newFiles.size) {
    return {
      type: 'deleteFile',
      message: oldMessage,
      files: oldMessage.attachments.difference(newFiles),
    };
  }
}

async function createMessageOption(state: State<StateType>) {
  const embed = new EmbedBuilder()
    .setTitle(langs.tl('eventLog.messageEdit.title'))
    .setURL(state.message.url)
    .setDescription(
      [
        langs.tl('fields.channel', state.message.channel),
        langs.tl('fields.member', state.message.author, 'label.sender'),
        langs.tl('fields.schedule', state.message.createdAt, 'label.sendAt'),
      ].join('\n'),
    )
    .setColor(stateColor[state.type])
    .setThumbnail(state.message.author.displayAvatarURL());
  if (state.type === 'edit') {
    embed.addFields(
      {
        name: langs.tl('label.before'),
        value: state.oldContent ?? langs.tl('label.none'),
      },
      {
        name: langs.tl('label.after'),
        value: state.newContent ?? langs.tl('label.none'),
      },
    );
  }
  const attachment = await createAttachment(state);
  if (attachment) return { embeds: [embed], files: [attachment] };
  return { embeds: [embed] };
}

async function createAttachment(state: State<StateType>) {
  if (state.type !== 'deleteFile') return;
  const zip = new AdmZip();
  for await (const attachment of state.files.values()) {
    const res = await axios
      .get(attachment.url, { responseType: 'arraybuffer' })
      .catch(() => null);
    if (!res) continue;
    zip.addFile(attachment.name, res.data);
  }
  return new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
}
