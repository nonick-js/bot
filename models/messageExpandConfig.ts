import { ChannelType } from 'discord-api-types/v10';
import { type Model, Schema, model, models } from 'mongoose';
import type { MessageExpandConfig } from '../zod/config';
import { guildId } from './util';

const messageExpandSchema = new Schema<typeof MessageExpandConfig._type>({
  guildId,
  allowExternalGuild: Schema.Types.Boolean,
  enabled: Schema.Types.Boolean,
  ignore: {
    channels: [Schema.Types.String],
    types: [ChannelType],
    prefixes: [Schema.Types.String],
  },
});

export default models?.messageExpandConfig
  ? (models.messageExpandConfig as Model<typeof MessageExpandConfig._type>)
  : model('messageExpandConfig', messageExpandSchema);
