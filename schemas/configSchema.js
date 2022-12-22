const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  serverId: { type: mongoose.SchemaTypes.String, required: true, unique: true },
  messageExpansion: { type: mongoose.SchemaTypes.Boolean, default: false },

  welcome: {
    enable: { type: mongoose.SchemaTypes.Boolean, default: false },
    channel: { type: mongoose.SchemaTypes.String, default: null },
    message: { type: mongoose.SchemaTypes.String, default: [
      '![user] **(![userTag])** さん',
      '**![serverName]**へようこそ！',
      'まずはルールを確認しよう！\n',
      '現在のメンバー数: **![memberCount]**人',
    ].join('\n') },
  },

  leave: {
    enable: { type: mongoose.SchemaTypes.Boolean, default: false },
    channel: { type: mongoose.SchemaTypes.String, default: null },
    message: { type: mongoose.SchemaTypes.String, default: '**![userTag]** さんがサーバーを退室しました👋' },
  },

  report: {
    channel: { type: mongoose.SchemaTypes.String, default: null },
    mention: {
      enable: { type: mongoose.SchemaTypes.Boolean, default: false },
      role: { type: mongoose.SchemaTypes.String, default: null },
    },
  },

  log: {
    enable: { type: mongoose.SchemaTypes.Boolean, default: false },
    channel: { type: mongoose.SchemaTypes.String, default: null },
    category: {
      timeout: { type: mongoose.SchemaTypes.Boolean, default: false },
      kick: { type: mongoose.SchemaTypes.Boolean, default: false },
      ban: { type: mongoose.SchemaTypes.Boolean, default: false },
    },
  },

  verification: {
    enable: { type: mongoose.SchemaTypes.Boolean, default: 0 },
    log: {
      enable: { type: mongoose.SchemaTypes.Boolean, default: 0 },
      channel: { type: mongoose.SchemaTypes.String, default: null },
    },
    level: {
      old: { type: mongoose.SchemaTypes.Number, default: null },
      new: { type: mongoose.SchemaTypes.Number, default: null },
    },
    time: {
      start: { type: mongoose.SchemaTypes.Number, default: null },
      end: { type: mongoose.SchemaTypes.Number, default: null },
    },
	},
});

module.exports = mongoose.model('Config', configSchema);