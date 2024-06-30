import { ChannelType } from 'discord-api-types/v10';
import mongoose, { type Model } from 'mongoose';
import type { MessageExpandConfig } from '../zod/config';
import { guildId } from './util';

const { Schema, model, models } = mongoose;

const messageExpandSchema = new Schema<typeof MessageExpandConfig._type>({
  guildId,
  allowExternalGuild: Schema.Types.Boolean,
  enabled: Schema.Types.Boolean,
  ignore: {
    channels: [Schema.Types.String],
    types: [{ type: Schema.Types.Number, enum: ChannelType }],
    prefixes: [{ type: Schema.Types.String, length: 1 }],
  },
});

export default models?.messageExpandConfig
  ? (models.messageExpandConfig as Model<typeof MessageExpandConfig._type>)
  : model('messageExpandConfig', messageExpandSchema);
