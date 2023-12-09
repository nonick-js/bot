import { Schema, model } from "mongoose";
import { GeneralSetting } from "../@types/Schema";

const schema = new Schema<GeneralSetting>({
  serverId: { required: true, unique: true, type: Schema.Types.String },
  lang: { type: Schema.Types.String, default: 'ja-JP' },
});

export default model<GeneralSetting>('GeneralSetting', schema);