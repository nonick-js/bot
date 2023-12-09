import { model, Schema } from 'mongoose';
import type { ServerData } from './types';
import { serverId } from "./util";

const schema = new Schema<ServerData>({
  serverId,
  analytics: [Schema.Types.Mixed],
  auditLog: [Schema.Types.Mixed],
  receiveNotification: [Schema.Types.String]
});

export default model<ServerData>('ServerData', schema);