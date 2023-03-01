import { BaseMessageOptions, ChannelType, Colors } from 'discord.js';
import { model, Schema, SchemaTypes } from 'mongoose';

type CustomMessageOptions = Pick<BaseMessageOptions, 'content' | 'files' | 'embeds'>;
type LogCategoryOptions = { enable: boolean, channel: (string | null) }

export interface IServerSettings {
  serverId: string,
  message: {
    join: { enable: boolean, channel: (string | null), messageOptions: CustomMessageOptions },
    leave: { enable: boolean, channel: (string | null), messageOptions: CustomMessageOptions },
    expansion: {
      enable: boolean,
      ignore: {
        types: (ChannelType[]),
        channels: (string[]),
      },
    },
  },
  report: {
    channel: (string | null),
    mention: { enable: boolean; role: (string | null) },
  },
  log: {
    timeout: LogCategoryOptions;
    kick: LogCategoryOptions;
    ban: LogCategoryOptions;
    voice: LogCategoryOptions;
  },
  changeVerificationLevel: {
    enable: boolean,
    log: { enable: boolean, channel: (string | null) },
    level: { old: (number | null), new: (number | null) },
    time: { start: (number | null), end: (number | null) },
  },
  autoPublic: { enable: boolean, channels: string[] },
  autoMod: {
    enable: boolean,
    log: { enable: boolean, channel: (string | null) },
    filter: {
      inviteUrl: boolean,
      token: boolean,
    },
    ignore: {
      channels: string[],
      roles: string[],
    },
  },
}

const ServerSettings = new Schema<IServerSettings>({
  serverId: { type: String, required: true, unique: true },
  message: {
    join: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
      messageOptions: {
        type: SchemaTypes.Mixed,
        default: { embeds: [ {
          title: 'WELCOME',
          description: '![user] **(![userTag])** さん、**![serverName]**へようこそ！',
          color: Colors.Green,
        } ] },
      },
    },
    leave: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
      messageOptions: {
        type: SchemaTypes.Mixed,
        default: { content: '**![userTag]** さんがサーバーを退室しました👋' },
      },
    },
    expansion: {
      enable: { type: Boolean, default: false },
      ignore: {
        types: { type: [Number], default: [] },
        channels: { type: [String], default: [] },
      },
    },
  },
  report: {
    channel: { type: String, default: null },
    mention: {
      enable: { type: Boolean, default: false },
      role: { type: String, default: null },
    },
  },
  log: {
    timeout: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
    kick: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
    ban: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
    voice: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
  },
  changeVerificationLevel: {
    enable: { type: Boolean, default: false },
    log: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
    level: {
      old: { type: Number, default: null },
      new: { type: Number, default: null },
    },
    time: {
      start: { type: Number, default: null },
      end: { type: Number, default: null },
    },
  },
  autoPublic: {
    enable: { type: Boolean, default: false },
    channels: { type: [String], default: [] },
  },
  autoMod: {
    enable: { type: Boolean, default: false },
    log: {
      enable: { type: Boolean, default: false },
      channel: { type: String, default: null },
    },
    filter: {
      inviteUrl: { type: Boolean, default: false },
      token: { type: Boolean, default: false },
    },
    ignore: {
      channels: { type: [String], default: [] },
      roles: { type: [String], default: [] },
    },
  },
});

export default model<IServerSettings>('ServerSettings', ServerSettings);