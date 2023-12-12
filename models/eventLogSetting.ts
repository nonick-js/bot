import { Schema, model } from 'mongoose';
import { EventLogData, EventLogSetting } from './types';
import { serverId, snowflake } from './util';

const logSchema = new Schema<EventLogData>({
  enable: Schema.Types.Boolean,
  channel: snowflake,
});

const schema = new Schema<EventLogSetting>({
  serverId,
  general: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
  },
  timeout: logSchema,
  kick: logSchema,
  ban: logSchema,
  voice: logSchema,
  messageCreate: logSchema,
  messageEdit: logSchema,
});

export default model<EventLogSetting>('EventLogSetting', schema);
