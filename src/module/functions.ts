import { ChatInputCommandInteraction, Guild } from 'discord.js';
import Config from '../../config.json';

export function isBlocked(guild: Guild | null): boolean {
  interface BlackListType { guilds: string[]; users: string[] }
  const blackList: BlackListType = Config.blackList;
  if (!guild) return false;
  return (blackList.guilds.includes(guild.id) || blackList.users.includes(guild.ownerId));
}

export function isURL(text: string): boolean {
  return (text.startsWith('https//') || text.startsWith('https://'));
}

export async function checkPermission(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!Config.admin.users.includes(interaction.user.id)) await interaction.reply({ content: '`❌` コマンドの実行権限がありません', ephemeral: true });
}