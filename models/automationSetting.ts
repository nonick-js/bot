import { Model, Schema, model, models } from 'mongoose';
import type { AutomationSettingSchema } from './types';
import { guildVerifyLevel, serverId, snowflake } from './util';

const schema = new Schema<AutomationSettingSchema>({
  serverId,
  publishAnnounce: {
    enable: Schema.Types.Boolean,
    channels: [snowflake],
  },
  memberVerify: {
    enable: Schema.Types.Boolean,
    log: {
      enable: Schema.Types.Boolean,
      channel: snowflake,
    },
    level: {
      before: { type: Schema.Types.Number, enum: guildVerifyLevel },
      after: { type: Schema.Types.Number, enum: guildVerifyLevel },
    },
    time: {
      start: Schema.Types.Number,
      end: Schema.Types.Number,
    },
  },
  createThread: {
    enable: Schema.Types.Boolean,
    channels: [snowflake],
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
  });
  return next();
});

export default models?.AutomationSetting
  ? (models.AutomationSetting as Model<AutomationSettingSchema>)
  : model<AutomationSettingSchema, Model<AutomationSettingSchema>>(
      'AutomationSetting',
      schema,
    );
