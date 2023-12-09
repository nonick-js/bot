import { model, Schema } from 'mongoose';
import type { ModerateSetting } from './types.d.ts';
import { serverId } from "./util";

const schema = new Schema<ModerateSetting>({
  serverId,
  autoMod: {
    enable: Schema.Types.Boolean,
    log: {
      enable: Schema.Types.Boolean,
      channel: Schema.Types.String,
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
      channels: [Schema.Types.String],
      roles: [Schema.Types.String],
    }
  }
});

export default model<ModerateSetting>('ModerateSetting', schema);