import { Schema, model } from "mongoose";
import { EventLogData, EventLogSetting } from "../@types/Schema";

const logSchema = new Schema<EventLogData>({
  enable: Schema.Types.Boolean,
  channel: Schema.Types.String,
  tag: Schema.Types.String,
});

const schema = new Schema<EventLogSetting>({
  serverId: Schema.Types.String,
  general: {
    enable: Schema.Types.Boolean,
    channel: Schema.Types.String,
  },
  timeout: logSchema,
  kick: logSchema,
  ban: logSchema,
  voice: logSchema,
  messageCreate: logSchema,
  messageEdit: logSchema,
});

export default model<EventLogSetting>('EventLogSetting', schema);