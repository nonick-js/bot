import { model, Schema } from 'mongoose';
import type { AutomationSetting } from './types';
import { guildVerifyLevel, serverId, snowflake } from "./util";

const schema = new Schema<AutomationSetting>({
  serverId,
  publishAnnounce: {
    enable: Schema.Types.Boolean,
    channels: [Schema.Types.String],
  },
  memberVerify: {
    enable: Schema.Types.Boolean,
    log: {
      enable: Schema.Types.Boolean,
      channel: snowflake,
    },
    level: {
      before: { type: Schema.Types.Number, enum: guildVerifyLevel },
      after: { type: Schema.Types.Number, enum: guildVerifyLevel },
    },
    time: {
      start: Schema.Types.Number,
      end: Schema.Types.Number,
    }
  },
  createThread: {
    enable: Schema.Types.Boolean,
    channels: [snowflake],
  },
});

export default model<AutomationSetting>('AutomationSetting', schema);