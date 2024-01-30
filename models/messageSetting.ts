import { Model, Schema, model, models } from 'mongoose';
import type { MessageSettingSchema } from './types.d.ts';
import { messageOptionSchema, serverId, snowflake } from './util';

const schema = new Schema<MessageSettingSchema>({
  serverId,
  join: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
    includeBot: Schema.Types.Boolean,
    messageOption: messageOptionSchema,
  },
  leave: {
    enable: Schema.Types.Boolean,
    channel: snowflake,
    includeBot: Schema.Types.Boolean,
    messageOption: messageOptionSchema,
  },
  expansion: {
    enable: Schema.Types.Boolean,
    allowExternal: Schema.Types.Boolean,
    ignore: {
      types: [Schema.Types.Number],
      channels: [snowflake],
      prefixes: [Schema.Types.String],
    },
  },
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

export default models?.MessageSetting
  ? (models.MessageSetting as Model<MessageSettingSchema>)
  : model<MessageSettingSchema, Model<MessageSettingSchema>>(
      'MessageSetting',
      schema,
    );
