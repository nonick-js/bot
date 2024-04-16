import { GuildVerificationLevel } from 'discord-api-types/v10';
import * as z from 'zod';
import { Snowflake } from './discord';

export const Guild = z.object({
  guildId: Snowflake,
  beforeVerifyLevel: z.nativeEnum(GuildVerificationLevel),
  createAt: z.date(),
});
