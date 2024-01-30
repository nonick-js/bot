import { Model, Schema, model, models } from 'mongoose';
import type { NotificationSchema } from './types';

const schema = new Schema<NotificationSchema>({
  title: { required: true, type: Schema.Types.String },
  description: { required: true, type: Schema.Types.String },
  tags: [Schema.Types.String],
  category: [Schema.Types.String],
  createAt: { required: true, type: Schema.Types.Date },
  updateAt: { required: true, type: Schema.Types.Date },
});

schema.pre('updateOne', async function (next) {
  this.setOptions({
    runValidators: true,
  });
  return next();
});

schema.pre('findOneAndUpdate', async function (next) {
  this.setOptions({
    runValidators: true,
    new: true,
  });
  return next();
});

export default models?.Notification
  ? (models?.Notification as Model<NotificationSchema>)
  : model<NotificationSchema, Model<NotificationSchema>>(
      'Notification',
      schema,
    );
