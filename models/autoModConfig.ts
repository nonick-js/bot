import { type Model, Schema, model, models } from 'mongoose';
import type { AutoModConfig } from '../zod/config';
import { guildId } from './util';

const autoModSchema = new Schema<typeof AutoModConfig._type>({
  guildId,
  enabled: Schema.Types.Boolean,
  filter: {
    domain: {
      enabled: Schema.Types.Boolean,
      list: [Schema.Types.String],
    },
    inviteUrl: Schema.Types.Boolean,
    token: Schema.Types.Boolean,
  },
  ignore: {
    channels: [Schema.Types.String],
    roles: [Schema.Types.String],
  },
  log: {
    enabled: Schema.Types.Boolean,
    channel: Schema.Types.String,
  },
});

export default models?.autoModConfig
  ? (models.autoModConfig as Model<typeof AutoModConfig._type>)
  : model('autoModConfig', autoModSchema);
