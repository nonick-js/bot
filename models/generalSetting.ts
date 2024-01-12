import { Locale } from 'discord-api-types/v10';
import { Model, Schema, model, models } from 'mongoose';
import { GeneralSettingSchema } from './types';
import { LangKey, serverId } from './util';

const schema = new Schema<GeneralSettingSchema>({
  serverId,
  lang: { type: Schema.Types.String, enum: LangKey, default: Locale.Japanese },
});

export default models?.GeneralSetting
  ? (models.GeneralSetting as Model<GeneralSettingSchema>)
  : model<GeneralSettingSchema, Model<GeneralSettingSchema>>(
      'GeneralSetting',
      schema,
    );
