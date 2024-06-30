import { GuildVerificationLevel } from 'discord-api-types/v10';
import { type Model, Schema, model, models } from 'mongoose';
import type { AutoChangeVerifyLevelConfig } from '../zod/config';
import { guildId } from './util';

const autoChangeVerifyLevelSchema = new Schema<
  typeof AutoChangeVerifyLevelConfig._type
>({
  guildId,
  enabled: { type: Schema.Types.Boolean },
  startHour: { type: Schema.Types.Number },
  endHour: { type: Schema.Types.Number },
  level: { type: Schema.Types.Number, enum: GuildVerificationLevel },
  log: {
    enabled: Schema.Types.Boolean,
    channel: Schema.Types.String,
  },
});

export default models?.autoChangeVerifyLevelConfig
  ? (models.autoChangeVerifyLevelConfig as Model<
      typeof AutoChangeVerifyLevelConfig._type
    >)
  : model('autoChangeVerifyLevelConfig', autoChangeVerifyLevelSchema);
