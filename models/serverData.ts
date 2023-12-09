import { model, Schema } from 'mongoose';
import type { ServerData } from './types';
import { serverId, snowflake } from "./util";

const schema = new Schema<ServerData>({
  serverId,
  analytics: [{
    date: { required: true, type: Schema.Types.Date },
    memberCount: { type: Schema.Types.Number },
    messageCount: { type: Schema.Types.Mixed },
  }],
  auditLog: [{
    user: { required: true, ...snowflake },
    type: { required: true, type: Schema.Types.String },
    date: { required: true, type: Schema.Types.Date },
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
  }],
  receiveNotification: [Schema.Types.String]
});

export default model<ServerData>('ServerData', schema);