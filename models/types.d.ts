import {
  APIEmbed,
  ChannelType,
  GuildVerificationLevel,
} from 'discord-api-types/v10';
import { LangKey } from './util';

// #region Collections
export interface AutomationSettingSchema extends BaseSchema {
  publishAnnounce: publishAnnounceSchema;
  memberVerify: memberVerifySchema;
  createThread: createThreadSchema;
}

export interface EventLogSettingSchema extends BaseSchema {
  general: BaseEventLog;
  kick: EventLogData;
  ban: EventLogData;
  timeout: EventLogData;
  messageDelete: EventLogData;
  messageEdit: EventLogData;
  voice: EventLogData;
}

export interface GeneralSettingSchema extends BaseSchema {
  lang: (typeof LangKey)[number];
}

export interface MessageSettingSchema extends BaseSchema {
  join: JoinAndLeaveSchema;
  leave: JoinAndLeaveSchema;
  expansion: ExpansionSchema;
}

export interface ModerateSettingSchema extends BaseSchema {
  report: ReportSchema;
  autoMod: AutoModSchema;
}

export interface NotificationSchema {
  title: string;
  description: string;
  tags: string[];
  category: string[];
  createAt: Date;
  updateAt: Date;
}

export interface ServerDataSchema extends BaseSchema {
  analytics: ServerAnalytics[];
  auditLog: AuditLogData[];
  receiveNotification: string[];
}
// #endregion

// #region Schemas
interface ServerAnalytics {
  date: Date;
  memberCount: number;
  /** { チャンネルID: メッセージ数 } */
  messageCount: Record<string, number>;
}

interface AuditLogData {
  /**変更した時間 */
  date: Date;
  /**ユーザーID */
  user: string;
  /**変更した内容 */
  type: string;
  /**変更前の内容 */
  before: unknown;
  /**変更後の内容 */
  after: unknown;
}

interface ReportSchema {
  channel: string;
  includeModerator: boolean;
  progressButton: boolean;
  mention: {
    enable: boolean;
    role: string;
  };
}

interface AutoModSchema {
  enable: boolean;
  log: {
    enable: boolean;
    channel: string;
  };
  filter: {
    domain: {
      enable: boolean;
      list: string[];
    };
    token: boolean;
    inviteUrl: boolean;
  };
  ignore: {
    channels: string[];
    roles: string[];
  };
}

interface JoinAndLeaveSchema {
  enable: boolean;
  channel: string;
  includeBot: boolean;
  messageOption: CustomMessageOptions;
}

interface ExpansionSchema {
  enable: boolean;
  allowExternal: boolean;
  ignore: {
    types: ChannelType[];
    channels: string[];
    prefixes: string[];
  };
}

interface publishAnnounceSchema {
  enable: boolean;
  channels: string[];
}

interface createThreadSchema {
  enable: boolean;
  channels: string[];
}

interface memberVerifySchema {
  enable: boolean;
  log: {
    enable: boolean;
    channel: string;
  };
  level: {
    before: GuildVerificationLevel;
    after: GuildVerificationLevel;
  };
  time: {
    start: number;
    end: number;
  };
}
// #endregion

// #region BaseTypes
type EventLogData = BaseEventLog;

interface BaseSchema {
  serverId: string;
}

interface BaseEventLog {
  enable: boolean;
  channel: string;
}

interface CustomMessageOptions {
  content?: string;
  embeds: APIEmbed[];
}
// #endregion
