import { model, Schema } from 'mongoose';
import type { MessageSetting } from './types.d.ts';
import { messageOptionSchema, serverId, snowflake } from "./util";

const schema = new Schema<MessageSetting>({
  serverId,
  join: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
    includeBot: Schema.Types.Boolean,
    messageOption: messageOptionSchema,
  },
  leave: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
    includeBot: Schema.Types.Boolean,
    messageOption: messageOptionSchema,
  },
  expansion: {
    enable: Schema.Types.Boolean,
    allowExternal: Schema.Types.Boolean,
    ignore: {
      types: [Schema.Types.Number],
      channels: [snowflake],
      prefixes: [Schema.Types.String],
    },
  },
});

export default model<MessageSetting>('MessageSetting', schema);