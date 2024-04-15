import * as z from 'zod';
import { Snowflake } from './discord';

export const AuditLog = z.object({
  guildId: Snowflake,
  authorId: Snowflake,
  before: z.any(),
  after: z.any(),
  createAt: z.date().optional(),
  reason: z.string().optional(),
});
