import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import * as z from 'zod';
import { MessageOption, Snowflake } from './discord';
import { findDuplicates, getDuplicateIndexes } from './util';

const hourError = { message: '0～23の間で設定する必要があります' };

const baseSchema = z.object({
  guildId: Snowflake,
});

export const LogConfig = z
  .object({
    enabled: z.boolean(),
    channel: Snowflake.nullable(),
  })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['channel'],
      });
    }
  });

// 入室メッセージ
export const JoinMessageConfig = baseSchema
  .extend({
    enabled: z.boolean(),
    channel: Snowflake.nullable(),
    message: MessageOption,
    ignoreBot: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['channel'],
      });
    }
  });

// 退室メッセージ
export const LeaveMessageConfig = baseSchema
  .extend({
    enabled: z.boolean(),
    channel: Snowflake.nullable(),
    message: MessageOption,
    ignoreBot: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.enabled && !v.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['channel'],
      });
    }
  });

// サーバー内通報
export const ReportConfig = baseSchema
  .extend({
    channel: Snowflake,
    includeModerator: z.boolean(),
    progressButton: z.boolean(),
    mention: z.object({
      enabled: z.boolean(),
      roles: z.array(Snowflake),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.mention.enabled && !v.mention.roles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'ロールが設定されていません',
        path: ['mention.roles'],
      });
    }
  });

// イベントログ
export const EventLogConfig = baseSchema.extend({
  timeout: LogConfig,
  kick: LogConfig,
  ban: LogConfig,
  voice: LogConfig,
  messageDelete: LogConfig,
  messageEdit: LogConfig,
});

// メッセージURL展開
export const MessageExpandConfig = baseSchema
  .extend({
    enabled: z.boolean(),
    allowExternalGuild: z.boolean(),
    ignore: z.object({
      channels: z.array(Snowflake),
      types: z.array(z.nativeEnum(ChannelType)),
      prefixes: z.array(z.string()).max(5, '5個以上のプレフィックスを登録することはできません'),
    }),
  })
  .superRefine((value, ctx) => {
    if (value.ignore.prefixes.some((v) => v.length !== 1)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'プレフィックスは1文字である必要があります',
        path: ['ignore.prefixes'],
      });
    }

    if (findDuplicates(value.ignore.prefixes).length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '重複している項目があります',
        path: ['ignore.prefixes'],
      });
    }
  });

// 自動アナウンス公開
export const AutoPublicConfig = baseSchema.extend({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

// 自動スレッド作成
export const AutoCreateThreadConfig = baseSchema.extend({
  enabled: z.boolean(),
  channels: z.array(Snowflake),
});

// 自動認証レベル変更
export const AutoChangeVerifyLevelConfig = baseSchema
  .extend({
    enabled: z.boolean(),
    level: z.nativeEnum(GuildVerificationLevel),
    startHour: z.coerce.number().int().min(0, hourError).max(23, hourError),
    endHour: z.coerce.number().int().min(0, hourError).max(23, hourError),
    log: LogConfig,
  })
  .superRefine((v, ctx) => {
    if (v.startHour === v.endHour) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '開始時刻と終了時刻を同じ値にすることはできません',
        path: ['starthour', 'endHour'],
      });
    }
    if (v.enabled && v.log.enabled && !v.log.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['logChannel'],
      });
    }
  });

// AutoMod Plus
export const AutoModConfig = baseSchema
  .extend({
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
    log: LogConfig,
  })
  .superRefine((v, ctx) => {
    if (v.enabled && v.log.enabled && !v.log.channel) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'チャンネルが設定されていません',
        path: ['logChannel'],
      });
    }
  });
