import { type Model, Schema, model, models } from 'mongoose';
import type { AuditLog } from '../zod/auditLog';

const AuditLogSchema = new Schema<typeof AuditLog._type>({
  guildId: { unique: true, type: Schema.Types.String },
  after: Schema.Types.Mixed,
  authorId: Schema.Types.String,
  before: Schema.Types.Mixed,
  createAt: Schema.Types.Date,
  reason: Schema.Types.String,
});

export default models?.auditLog
  ? (models.auditLog as Model<typeof AuditLog._type>)
  : model('auditLog', AuditLogSchema);
