import { GuildVerificationLevel } from "discord-api-types/v10";
import { Schema, SchemaDefinitionProperty } from "mongoose";
import { CustomMessageOptions } from "./types";

export const LangKey = ['ja-JP'] as const;
export const snowflake: SchemaDefinitionProperty<string> = { type: Schema.Types.String, match: /\d{17,}/ };
export const serverId: SchemaDefinitionProperty<string> = { required: true, unique: true, ...snowflake };
export const guildVerifyLevel: GuildVerificationLevel[] = [
  GuildVerificationLevel.None,
  GuildVerificationLevel.Low,
  GuildVerificationLevel.Medium,
  GuildVerificationLevel.High,
  GuildVerificationLevel.VeryHigh,
]

export const messageOptionSchema = new Schema<CustomMessageOptions>({
  content: Schema.Types.String,
  embeds: [
    {
      title: { type: Schema.Types.String, maxlength: 256 },
      description: { type: Schema.Types.String, maxlength: 4096 },
      url: { type: Schema.Types.String, match: /^https?:\/\// },
      timestamp: { type: Schema.Types.String },
      color: { type: Schema.Types.Number, min: 0x000000, max: 0xFFFFFF },
      footer: {
        text: { type: Schema.Types.String, maxlength: 2048 },
        icon_url: { type: Schema.Types.String, match: /^https?:\/\// },
      },
      image: {
        url: { type: Schema.Types.String, match: /^https?:\/\// },
      },
      thumbnail: {
        url: { type: Schema.Types.String, match: /^https?:\/\// },
      },
      author: {
        name: { type: Schema.Types.String, maxlength: 256 },
        url: { type: Schema.Types.String, match: /^https?:\/\// },
        icon_url: { type: Schema.Types.String, match: /^https?:\/\// },
      },
      fields: [{
        name: { type: Schema.Types.String, maxlength: 256 },
        value: { type: Schema.Types.String, maxlength: 1024 },
        inline: { type: Schema.Types.Boolean }
      }]
    }
  ]
})