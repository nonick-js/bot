import ServerSettings, { IServerSettings } from '../../schemas/ServerSettings';

export async function getServerSetting<T extends keyof IServerSettings>(guildId: string, path: T) {
	return (await ServerSettings.findOne({ serverId: guildId }))?.[path];
}