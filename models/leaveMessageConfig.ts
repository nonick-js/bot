import { type Model, Schema, model, models } from 'mongoose';
import type { LeaveMessageConfig } from '../zod/config';
import { guildId, messageOptionSchema, snowflake } from './util';

const leaveMessageSchema = new Schema<typeof LeaveMessageConfig._type>({
  guildId,
  channel: snowflake,
  enabled: Schema.Types.Boolean,
  ignoreBot: Schema.Types.Boolean,
  message: messageOptionSchema,
});

export default models?.leaveMessageConfig
  ? (models.leaveMessageConfig as Model<typeof LeaveMessageConfig._type>)
  : model('leaveMessageConfig', leaveMessageSchema);
