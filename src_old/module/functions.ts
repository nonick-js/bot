import { ChatInputCommandInteraction, Guild, PermissionsBitField } from 'discord.js';
import Config from '../config.json';

const dangerPermissions = new Map([
  [ 'Administrator', '管理者' ],
  [ 'KickMembers', 'メンバーをKick' ],
  [ 'BanMembers', 'メンバーをBan' ],
  [ 'ManageChannels', 'チャンネルを管理' ],
  [ 'ManageGuild', 'サーバーを管理' ],
  [ 'ManageMessages', 'メッセージを管理' ],
  [ 'ManageRoles', 'ロールを管理' ],
  [ 'ManageWebhooks', 'ウェブフックの管理' ],
  [ 'ManageEmojisAndStickers', '絵文字・スタンプの管理' ],
  [ 'ManageEvents', 'イベントの管理' ],
  [ 'ManageThreads', 'スレッドの管理' ],
  [ 'ModerateMembers', 'メンバーの管理' ],
]);

export function isBlocked(guild: Guild | null): boolean {
  interface BlackListType { guilds: string[]; users: string[] }
  const blackList: BlackListType = Config.blackList;

  if (!guild) return false;
  return (blackList.guilds.includes(guild.id) || blackList.users.includes(guild.ownerId));
}

export function isURL(text: string): boolean {
  return (text.startsWith('http://') || text.startsWith('https://'));
}

export function omitString(text: string, limit: number): string {
  return text.length > limit ? `${text.substring(0, limit - 4)} ...` : text;
}

export function checkAndFormatDangerPermission(permissions: Readonly<PermissionsBitField>) {
  return permissions.toArray().map(v => dangerPermissions.get(v)).filter(Boolean);
}

export async function checkPermission(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!Config.admin.users.includes(interaction.user.id)) await interaction.reply({ content: '`❌` コマンドの実行権限がありません', ephemeral: true });
}