import { GuildVerificationLevel } from 'discord-api-types/v10';
import { type Model, Schema, model, models } from 'mongoose';
import type { Guild } from '../zod/guild';
import { guildId } from './util';

const guildSchema = new Schema<typeof Guild._type>({
  guildId,
  beforeVerifyLevel: {
    type: Schema.Types.Number,
    enum: GuildVerificationLevel,
  },
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.guild
  ? (models.guild as Model<typeof Guild._type>)
  : model('guild', guildSchema);
