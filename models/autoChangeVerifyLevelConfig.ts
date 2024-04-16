import { GuildVerificationLevel } from 'discord-api-types/v10';
import { type Model, Schema, model, models } from 'mongoose';
import type { AutoChangeVerifyLevelConfig } from '../zod/config';
import { guildId } from './util';

const autoChangeVerifyLevelSchema = new Schema<
  typeof AutoChangeVerifyLevelConfig._type
>({
  guildId,
  enabled: Schema.Types.Boolean,
  startHour: Schema.Types.Number,
  endHour: Schema.Types.Number,
  level: GuildVerificationLevel,
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
