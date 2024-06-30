import { type Model, Schema, model, models } from 'mongoose';
import type { AutoPublicConfig } from '../zod/config';
import { guildId } from './util';

const autoPublicSchema = new Schema<typeof AutoPublicConfig._type>({
  guildId,
  channels: [Schema.Types.String],
  enabled: Schema.Types.Boolean,
});

export default models?.autoPublicConfig
  ? (models.autoPublicConfig as Model<typeof AutoPublicConfig._type>)
  : model('autoPublicConfig', autoPublicSchema);
