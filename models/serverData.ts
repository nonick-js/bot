import { Model, Schema, model, models } from 'mongoose';
import type { ServerDataSchema } from './types';
import { serverId, snowflake } from './util';

const schema = new Schema<ServerDataSchema>({
  serverId,
  analytics: [
    {
      date: { required: true, type: Schema.Types.Date },
      memberCount: { type: Schema.Types.Number },
      messageCount: { type: Schema.Types.Mixed },
    },
  ],
  auditLog: [
    {
      user: { required: true, ...snowflake },
      type: { required: true, type: Schema.Types.String },
      date: { required: true, type: Schema.Types.Date },
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },
  ],
  receiveNotification: [Schema.Types.String],
});

export default models?.ServerData
  ? (models.ServerData as Model<ServerDataSchema>)
  : model<ServerDataSchema, Model<ServerDataSchema>>('ServerData', schema);
