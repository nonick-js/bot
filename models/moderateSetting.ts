import { Schema, model } from 'mongoose';
import type { ModerateSettingSchema } from './types.d.ts';
import { serverId, snowflake } from './util';

const schema = new Schema<ModerateSettingSchema>({
  serverId,
  autoMod: {
    enable: Schema.Types.Boolean,
    log: {
      enable: Schema.Types.Boolean,
      channel: snowflake,
    },
    filter: {
      domain: {
        enable: Schema.Types.Boolean,
        list: [Schema.Types.String],
      },
      token: Schema.Types.Boolean,
      inviteUrl: Schema.Types.Boolean,
    },
    ignore: {
      channels: [snowflake],
      roles: [snowflake],
    },
  },
});

export default model<ModerateSettingSchema>('ModerateSetting', schema);
