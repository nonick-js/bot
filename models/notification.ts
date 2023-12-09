import { model, Schema } from 'mongoose';
import type { Notification } from './types';

const schema = new Schema<Notification>({
  title: Schema.Types.String,
  desc: Schema.Types.String,
  tags: [Schema.Types.String],
  category: [Schema.Types.String],
  createAt: Schema.Types.Date,
  updateAt: Schema.Types.Date,
});

export default model<Notification>('Notification', schema);