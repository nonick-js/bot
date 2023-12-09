import { model, Schema } from 'mongoose';
import type { AutomationSetting } from './types';

const schema = new Schema<AutomationSetting>({
  serverId: { required: true, unique: true, type: Schema.Types.String },
  publishAnnounce: {
    enable: Schema.Types.Boolean,
    channels: [Schema.Types.String],
  },
  memberVerify: {
    enable: Schema.Types.Boolean,
    log: {
      enable: Schema.Types.Boolean,
      channel: Schema.Types.String,
    },
    level: {
      before: Schema.Types.Number,
      after: Schema.Types.Number,
    },
    time: {
      start: Schema.Types.Number,
      end: Schema.Types.Number,
    }
  },
  createThread: {
    enable: Schema.Types.Boolean,
    channels: [Schema.Types.String],
  },
});

export default model<AutomationSetting>('AutomationSetting', schema);