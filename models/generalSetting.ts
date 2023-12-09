import { Schema, model } from "mongoose";
import { GeneralSetting } from "./types";
import { LangKey, serverId } from "./util";

const schema = new Schema<GeneralSetting>({
  serverId,
  lang: { type: Schema.Types.String, enum: LangKey, default: 'ja-JP' },
});

export default model<GeneralSetting>('GeneralSetting', schema);