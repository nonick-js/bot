import { model, Schema, SchemaTypes } from 'mongoose';

const ServerSettings = new Schema({
  serverId: { type: SchemaTypes.String, require: true, unique: true },

  messageExpansion: { type: SchemaTypes.Boolean, default: false },

  welcomeMessage: {
    enable: { type: SchemaTypes.Boolean, default: false },
    channel: { type: SchemaTypes.String, default: null },
    message: { type: SchemaTypes.String, default: '![user] **(![userTag])** さん、**![serverName]**へようこそ！' },
  },

  leaveMessage: {
    enable: { type: SchemaTypes.Boolean, default: false },
    channel: { type: SchemaTypes.String, default: null },
    message: { type: SchemaTypes.String, default: '**![userTag]** さんがサーバーを退室しました👋' },
  },

  report: {
    channel: { type: SchemaTypes.String, default: null },
    mention: {
      enable: { type: SchemaTypes.Boolean, default: false },
      role: { type: SchemaTypes.String, default: null },
    },
  },

  log: {
    enable: { type: SchemaTypes.Boolean, default: false },
    channel: { type: SchemaTypes.String, default: null },
    category: {
      timeout: { type: SchemaTypes.Boolean, default: false },
      kick: { type: SchemaTypes.Boolean, default: false },
      ban: { type: SchemaTypes.Boolean, default: false },
    },
  },

  verification: {
    enable: { type: SchemaTypes.Boolean },
    log: {
      enable: { type: SchemaTypes.Boolean },
      channel: { type: SchemaTypes.String },
    },
    level: {
      before: { type: SchemaTypes.Number },
      after: { type: SchemaTypes.Number },
    },
    time: {
      start: { type: SchemaTypes.Number },
      end: { type: SchemaTypes.Number },
    },
	},
});

export default model('ServerSettings', ServerSettings);