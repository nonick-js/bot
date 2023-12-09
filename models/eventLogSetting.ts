import { Schema, model } from "mongoose";
import { EventLogData, EventLogSetting } from "./types";
import { serverId } from "./util";

const logSchema = new Schema<EventLogData>({
  enable: Schema.Types.Boolean,
  channel: Schema.Types.String,
  tag: Schema.Types.String,
});

const schema = new Schema<EventLogSetting>({
  serverId,
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