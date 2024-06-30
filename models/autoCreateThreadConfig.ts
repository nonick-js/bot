import mongoose, { type Model } from 'mongoose';
import type { AutoCreateThreadConfig } from '../zod/config';
import { guildId } from './util';

const { Schema, model, models } = mongoose;

const autoCreateThreadSchema = new Schema<typeof AutoCreateThreadConfig._type>({
  guildId,
  channels: [Schema.Types.String],
  enabled: Schema.Types.Boolean,
});

export default models?.autoCreateThreadConfig
  ? (models.autoCreateThreadConfig as Model<typeof AutoCreateThreadConfig._type>)
  : model('autoCreateThreadConfig', autoCreateThreadSchema);
