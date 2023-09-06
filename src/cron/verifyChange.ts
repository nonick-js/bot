import ServerSettings, { IServerSettings } from '@models/ServerSettings';
import { CronBuilder } from '@modules/cron';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Colors, EmbedBuilder, Guild, inlineCode } from 'discord.js';
import { client } from 'index';
dayjs.extend(timezone);
dayjs.extend(utc);

const verificationLevelData = [
  { name: '設定しない', description: '無制限' },
  { name: '低', description: 'メール認証がされているアカウントのみ' },
  { name: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ' },
  { name: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ' },
  { name: '最高', description: '電話認証がされているアカウントのみ' },
];

export default new CronBuilder({ minute: 0 }, () => {
  const now = dayjs().tz('Asia/Tokyo').get('hour');
  start(now);
  end(now);
});

async function start(hour: number) {
  const settings = await ServerSettings.find({
    'changeVerificationLevel.enable': true,
    'changeVerificationLevel.time.start': hour,
  });

  for (const setting of settings) {
    const guild = await client.guilds.fetch(setting.serverId).catch(() => null);
    const level = setting.changeVerificationLevel.level.new;
    if (!guild || level == null) return;

    setting.changeVerificationLevel.level.old = guild.verificationLevel;
    await setting.save({ wtimeout: 1_500 });
    guild.setVerificationLevel(level)
      .then(() => sendLog(guild, setting, level, '開始'))
      .catch(console.error);
  }
}

async function end(hour: number) {
  const settings = await ServerSettings.find({
    'changeVerificationLevel.enable': true,
    'changeVerificationLevel.time.end': hour,
  });

  for (const setting of settings) {
    const guild = await client.guilds.fetch(setting.serverId).catch(() => null);
    const level = setting.changeVerificationLevel.level.old;
    if (!guild || level == null) return;

    guild.setVerificationLevel(level)
      .then(() => sendLog(guild, setting, level, '終了'))
      .catch(console.error);
  }
}

async function sendLog(guild: Guild, setting: IServerSettings, level: number, label: string) {
  if (
    !setting.changeVerificationLevel.log.enable ||
    !setting.changeVerificationLevel.log.channel
  ) return;

  const channel = await guild.channels.fetch(setting.changeVerificationLevel.log.channel)
    .catch(() => null);
  if (!channel?.isTextBased()) return;

  channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle(`\`✅\` 認証レベル自動変更 - ${label}`)
        .setDescription([
          `サーバーの認証レベルを**${verificationLevelData[level].name}**に変更しました`,
          inlineCode(verificationLevelData[level].description),
        ].join('\n'))
        .setColor(Colors.Green),
    ],
  }).catch(console.error);
}