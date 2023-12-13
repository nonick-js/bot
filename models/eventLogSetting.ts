import { Schema, model } from 'mongoose';
import { EventLogData, EventLogSettingSchema } from './types';
import { serverId, snowflake } from './util';

const logSchema = new Schema<EventLogData>({
  enable: Schema.Types.Boolean,
  channel: snowflake,
});

const schema = new Schema<EventLogSettingSchema>({
  serverId,
  general: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
  },
  timeout: logSchema,
  kick: logSchema,
  ban: logSchema,
  voice: logSchema,
  messageDelete: logSchema,
  messageEdit: logSchema,
});

export default model<EventLogSettingSchema>('EventLogSetting', schema);
