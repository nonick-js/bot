import mongoose, { type Model } from 'mongoose';
import type { EventLogConfig, LogConfig } from '../zod/config';
import { guildId } from './util';

const { Schema, model, models } = mongoose;

const LogSchema = new Schema<typeof LogConfig._type>({
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
});

const eventLogSchema = new Schema<typeof EventLogConfig._type>({
  guildId,
  ban: LogSchema,
  kick: LogSchema,
  messageDelete: LogSchema,
  messageEdit: LogSchema,
  timeout: LogSchema,
  voice: LogSchema,
});

export default models?.eventLogConfig
  ? (models.eventLogConfig as Model<typeof EventLogConfig._type>)
  : model('eventLogConfig', eventLogSchema);
