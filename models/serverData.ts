import { model, Schema } from 'mongoose';
import type { ServerData } from './types';

const schema = new Schema<ServerData>({
  serverId: Schema.Types.String,
  analytics: [Schema.Types.Mixed],
  auditLog: [Schema.Types.Mixed],
  receiveNotification: [Schema.Types.String]
});

export default model<ServerData>('ServerData', schema);