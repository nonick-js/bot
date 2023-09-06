import { BaseMessageOptions, ChannelType, Colors } from 'discord.js';
import { model, Schema } from 'mongoose';

type CustomMessageOptions = Pick<BaseMessageOptions, 'content' | 'files' | 'embeds'>;
type LogCategoryOptions = { enable: boolean, channel: string };

export interface IServerSettings {
  serverId: string,
  message: {
    join: { enable: boolean, channel: string, messageOptions: CustomMessageOptions },
    leave: { enable: boolean, channel: string, messageOptions: CustomMessageOptions },
    expansion: {
      enable: boolean,
      ignore: {
        types: (ChannelType[]),
        channels: (string[]),
      },
    },
  },
  report: {
    channel: string,
    mention: { enable: boolean; role: string },
  },
  log: {
    timeout: LogCategoryOptions;
    kick: LogCategoryOptions;
    ban: LogCategoryOptions;
    voice: LogCategoryOptions;
    delete: LogCategoryOptions;
  },
  changeVerificationLevel: {
    enable: boolean,
    log: { enable: boolean, channel: string },
    level: { old: number, new: number },
    time: { start: number, end: number },
  },
  autoPublic: { enable: boolean, channels: string[] },
  autoMod: {
    enable: boolean,
    log: { enable: boolean, channel: string },
    filter: {
      inviteUrl: boolean,
      token: boolean,
      shortUrl: boolean,
    },
    ignore: {
      channels: string[],
      roles: string[],
    },
  },
  autoCreateThread: { enable: boolean, channels: string[] },
}

const ServerSettings = new Schema<IServerSettings>({
  serverId: { type: Schema.Types.String, required: true, unique: true },
  message: {
    join: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
      messageOptions: {
        type: Schema.Types.Mixed,
        default: {
          embeds: [{
            title: 'WELCOME',
            description: '![user] **(![userTag])** さん、**![serverName]**へようこそ！',
            color: Colors.Green,
          }],
        },
      },
    },
    leave: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
      messageOptions: {
        type: Schema.Types.Mixed,
        default: { content: '**![userTag]** さんがサーバーを退室しました👋' },
      },
    },
    expansion: {
      enable: { type: Schema.Types.Boolean },
      ignore: {
        types: { type: [Schema.Types.Number] },
        channels: { type: [Schema.Types.String] },
      },
    },
  },
  report: {
    channel: { type: Schema.Types.String },
    mention: {
      enable: { type: Schema.Types.Boolean },
      role: { type: Schema.Types.String },
    },
  },
  log: {
    timeout: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    kick: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    ban: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    voice: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    delete: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
  },
  changeVerificationLevel: {
    enable: { type: Schema.Types.Boolean },
    log: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    level: {
      old: { type: Schema.Types.Number },
      new: { type: Schema.Types.Number },
    },
    time: {
      start: { type: Schema.Types.Number },
      end: { type: Schema.Types.Number },
    },
  },
  autoPublic: {
    enable: { type: Schema.Types.Boolean },
    channels: { type: [Schema.Types.String] },
  },
  autoMod: {
    enable: { type: Schema.Types.Boolean },
    log: {
      enable: { type: Schema.Types.Boolean },
      channel: { type: Schema.Types.String },
    },
    filter: {
      inviteUrl: { type: Schema.Types.Boolean },
      token: { type: Schema.Types.Boolean },
      shortUrl: { type: Schema.Types.Boolean },
    },
    ignore: {
      channels: { type: [Schema.Types.String] },
      roles: { type: [Schema.Types.String] },
    },
  },
  autoCreateThread: {
    enable: { type: Schema.Types.Boolean },
    channels: { type: [Schema.Types.String] },
  },
});

export default model<IServerSettings>('ServerSettings', ServerSettings);