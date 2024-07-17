import { z } from 'zod';
import { Snowflake } from './util';

const AutoModConfig = z
  .object({
    enabled: z.boolean(),
    filter: z.object({
      domain: z.object({
        enabled: z.boolean(),
        list: z
          .array(
            z
              .string()
              .regex(/^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/, '無効なドメインです'),
          )
          .max(20, '20個以上のドメインを登録することはできません'),
      }),
      token: z.boolean(),
      inviteUrl: z.boolean(),
    }),
    ignore: z.object({
      channels: z.array(Snowflake),
      roles: z.array(Snowflake),
    }),
    log: z.object({
      enabled: z.boolean(),
      channel: Snowflake.nullable(),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.enabled && v.log.enabled && !v.log.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['log.channel'],
      });
    }
  });

export default AutoModConfig;
