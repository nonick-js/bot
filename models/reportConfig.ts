import { type Model, Schema, model, models } from 'mongoose';
import type { ReportConfig } from '../zod/config';
import { guildId, snowflake } from './util';

const reportSchema = new Schema<typeof ReportConfig._type>({
  guildId,
  channel: snowflake,
  includeModerator: Schema.Types.Boolean,
  mentionEnabled: Schema.Types.Boolean,
  mentionRole: Schema.Types.String,
  progressButton: Schema.Types.Boolean,
});

export default models?.reportConfig
  ? (models.reportConfig as Model<typeof ReportConfig._type>)
  : model('reportConfig', reportSchema);
