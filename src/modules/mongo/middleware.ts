import ServerSettings, { IServerSettings } from '@models/ServerSettings';

export async function getServerSetting<T extends keyof IServerSettings>(guildId: string, path: T) {
  return await ServerSettings.findOne({ serverId: guildId }).then(v => v?.[path]);
}