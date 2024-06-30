import * as z from 'zod';
import { Snowflake } from './discord';

const baseSchema = z.object({
  guildId: Snowflake,
  authorId: Snowflake,
  before: z.any(),
  after: z.any(),
  createAt: z.date().optional(),
});

export default baseSchema;