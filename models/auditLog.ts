import { type Model, Schema, model, models } from 'mongoose';
import type { AuditLog } from '../zod/auditLog';
import { guildId } from './util';

const AuditLogSchema = new Schema<typeof AuditLog._type>({
  guildId,
  after: Schema.Types.Mixed,
  authorId: Schema.Types.String,
  before: Schema.Types.Mixed,
  reason: Schema.Types.String,
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.auditLog
  ? (models.auditLog as Model<typeof AuditLog._type>)
  : model('auditLog', AuditLogSchema);
