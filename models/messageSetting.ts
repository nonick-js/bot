import { model, Schema } from 'mongoose';
import type { MessageSetting } from './types.d.ts';

const schema = new Schema<MessageSetting>({
  serverId: Schema.Types.String,
  join: {
    enable: Schema.Types.Boolean,
    channel: Schema.Types.String,
    includeBot: Schema.Types.Boolean,
    messageOption: Schema.Types.Mixed,
  },
  leave: {
    enable: Schema.Types.Boolean,
    channel: Schema.Types.String,
    includeBot: Schema.Types.Boolean,
    messageOption: Schema.Types.Mixed,
  },
  expansion: {
    enable: Schema.Types.Boolean,
    allowExternal: Schema.Types.Boolean,
    ignore: {
      types: [Schema.Types.Number],
      channel: [Schema.Types.String],
      prefixes: [Schema.Types.String],
    },
  },
});

export default model<MessageSetting>('MessageSetting', schema);