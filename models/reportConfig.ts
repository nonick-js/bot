import mongoose, { type Model } from 'mongoose';
import type { ReportConfig } from '../zod/config';
import { guildId } from './util';

const { Schema, model, models } = mongoose;

const reportSchema = new Schema<typeof ReportConfig._type>({
  guildId,
  channel: Schema.Types.String,
  includeModerator: Schema.Types.Boolean,
  progressButton: Schema.Types.Boolean,
  mention: {
    enabled: Schema.Types.Boolean,
    roles: [Schema.Types.String],
  },
});

export default models?.reportConfig
  ? (models.reportConfig as Model<typeof ReportConfig._type>)
  : model('reportConfig', reportSchema);
