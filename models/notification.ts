import { model, Schema } from 'mongoose';
import type { Notification } from './types';

const schema = new Schema<Notification>({
  title: { required: true, type: Schema.Types.String },
  description: { required: true, type: Schema.Types.String },
  tags: [Schema.Types.String],
  category: [Schema.Types.String],
  createAt: { required: true, type: Schema.Types.Date },
  updateAt: { required: true, type: Schema.Types.Date },
});

export default model<Notification>('Notification', schema);