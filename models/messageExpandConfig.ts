import { ChannelType } from 'discord.js';
import { type Model, Schema, model, models } from 'mongoose';
import type { MessageExpandConfig } from '../zod/config';
import { guildId } from './util';

const eventLogSchema = new Schema<typeof MessageExpandConfig._type>({
  guildId,
  allowExternalGuild: Schema.Types.Boolean,
  enabled: Schema.Types.Boolean,
  ignoreChannels: [Schema.Types.String],
  ignorePrefixes: [Schema.Types.String],
  ignoreTypes: [ChannelType],
});

export default models?.messageExpandConfig
  ? (models.messageExpandConfig as Model<typeof MessageExpandConfig._type>)
  : model('messageExpandConfig', eventLogSchema);
