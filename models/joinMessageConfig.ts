import mongoose, { type Model } from 'mongoose';
import type { JoinMessageConfig } from '../zod/config';
import { guildId, messageOptionSchema } from './util';

const { Schema, model, models } = mongoose;

const joinMessageSchema = new Schema<typeof JoinMessageConfig._type>({
  guildId,
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
  ignoreBot: Schema.Types.Boolean,
  message: messageOptionSchema,
});

export default models?.joinMessageConfig
  ? (models.joinMessageConfig as Model<typeof JoinMessageConfig._type>)
  : model('joinMessageConfig', joinMessageSchema);
