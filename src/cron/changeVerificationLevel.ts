import { ChannelType, Client, Colors, EmbedBuilder, Guild, inlineCode } from 'discord.js';
import { Document } from 'mongoose';
import ServerSettings, { IServerSettings } from '../schemas/ServerSettings';

const verificationLevelData = [
  { name: '設定しない', description: '無制限' },
  { name: '低', description: 'メール認証がされているアカウントのみ' },
  { name: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ' },
  { name: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ' },
  { name: '最高', description: '電話認証がされているアカウントのみ' },
];

const start = async (client: Client, hour: number) => {
  const Settings = await ServerSettings.find({ 'changeVerificationLevel.enable': true, 'changeVerificationLevel.time.start': hour });

  for await (const Setting of Settings) {
    const guild = await client.guilds.fetch(Setting.serverId).catch(() => null);
    const level = Setting.changeVerificationLevel.level.new;
    if (!guild || level == null) return;

    Setting.changeVerificationLevel.level.old = guild.verificationLevel;
    await Setting.save({ wtimeout: 1_500 });

    guild.setVerificationLevel(level)
      .then(() => sendLog(guild, Setting, level, '開始'))
      .catch(() => { });
  }
};

const end = async (client: Client, hour: number) => {
  const Settings = await ServerSettings.find({ 'changeVerificationLevel.enable': true, 'changeVerificationLevel.time.end': hour });

  for await (const Setting of Settings) {
    const guild = await client.guilds.fetch(Setting.serverId).catch(() => null);
    const level = Setting.changeVerificationLevel.level.old;
    if (!guild || level == null) return;

    guild.setVerificationLevel(level)
      .then(() => sendLog(guild, Setting, level, '終了'))
      .catch(() => { });
  }
};

async function sendLog(guild: Guild, setting: (Document<unknown, unknown, IServerSettings> & IServerSettings), level: number, label: string) {
  if (!setting.changeVerificationLevel.log.enable || !setting.changeVerificationLevel.log.channel) return;

  const channel = await guild.channels.fetch(setting.changeVerificationLevel.log.channel).catch(() => null);

  if (channel?.type !== ChannelType.GuildText) {
    setting.changeVerificationLevel.log.enable = false;
    setting.changeVerificationLevel.log.channel = null;
    return setting.save({ wtimeout: 1500 });
  }

  channel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`\`✅\` 認証レベル自動変更 - ${label}`)
          .setDescription([
            `サーバーの認証レベルを**${verificationLevelData[level].name}**に変更しました`,
            inlineCode(verificationLevelData[level].description),
          ].join('\n'))
          .setColor(Colors.Green),
      ],
    })
    .catch(() => { });
}

export default (client: Client) => [start, end].forEach(v => v(client, (new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))).getHours()));
