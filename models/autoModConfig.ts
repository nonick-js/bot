import { GuildVerificationLevel } from 'discord.js';
import { type Model, Schema, model, models } from 'mongoose';
import type { AutoModConfig } from '../zod/config';
import { guildId } from './util';

const autoModSchema = new Schema<typeof AutoModConfig._type>({
  guildId,
  enabled: Schema.Types.Boolean,
  domainFilter: Schema.Types.Boolean,
  domainFilterList: [Schema.Types.String],
  ignoreChannels: [Schema.Types.String],
  ignoreRoles: [Schema.Types.String],
  inviteUrlFilter: Schema.Types.Boolean,
  logChannel: Schema.Types.String,
  logEnabled: Schema.Types.Boolean,
  tokenFilter: Schema.Types.Boolean,
});

export default models?.autoModConfig
  ? (models.autoModConfig as Model<typeof AutoModConfig._type>)
  : model('autoModConfig', autoModSchema);
