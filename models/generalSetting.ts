import { Locale } from 'discord.js';
import { Schema, model } from 'mongoose';
import { GeneralSettingSchema } from './types';
import { LangKey, serverId } from './util';

const schema = new Schema<GeneralSettingSchema>({
  serverId,
  lang: { type: Schema.Types.String, enum: LangKey, default: Locale.Japanese },
});

export default model<GeneralSettingSchema>('GeneralSetting', schema);
