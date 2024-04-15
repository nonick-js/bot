import { GuildVerificationLevel } from 'discord.js';
import { type Model, Schema, model, models } from 'mongoose';
import type { AutoChangeVerifyLevelConfig } from '../zod/config';
import { guildId } from './util';

const autoChangeVerifyLevelSchema = new Schema<
  typeof AutoChangeVerifyLevelConfig._type
>({
  guildId,
  enabled: Schema.Types.Boolean,
  endHour: Schema.Types.Number,
  level: GuildVerificationLevel,
  logChannel: Schema.Types.String,
  logEnabled: Schema.Types.String,
  startHour: Schema.Types.Number,
});

export default models?.autoChangeVerifyLevelConfig
  ? (models.autoChangeVerifyLevelConfig as Model<
      typeof AutoChangeVerifyLevelConfig._type
    >)
  : model('autoChangeVerifyLevelConfig', autoChangeVerifyLevelSchema);
