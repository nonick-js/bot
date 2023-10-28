import { Schema, model } from 'mongoose';
import { IServerSettings } from './ServerSettings';

export interface IGuildCache {
  serverId: string;
}

const GuildCache = new Schema<IGuildCache>({ serverId: { type: String, required: true, unique: true } });

export default model<IServerSettings>('GuildCaches', GuildCache);
