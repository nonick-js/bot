import { AutomationSetting, type AutomationSettingSchema } from '@models';
import { CronBuilder } from '@modules/cron';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {
  Colors,
  EmbedBuilder,
  type Guild,
  GuildVerificationLevel,
  inlineCode,
} from 'discord.js';
import { client } from 'index';
dayjs.extend(timezone);
dayjs.extend(utc);

const levels: Record<
  GuildVerificationLevel,
  { name: string; description: string }
> = {
  [GuildVerificationLevel.None]: {
    name: '設定無し',
    description: '無制限',
  },
  [GuildVerificationLevel.Low]: {
    name: '低',
    description: 'メール認証がされているアカウントのみ',
  },
  [GuildVerificationLevel.Medium]: {
    name: '中',
    description: 'Discordに登録してから5分以上経過したアカウントのみ',
  },
  [GuildVerificationLevel.High]: {
    name: '高',
    description:
      'このサーバーのメンバーとなってから10分以上経過したメンバーのみ',
  },
  [GuildVerificationLevel.VeryHigh]: {
    name: '最高',
    description: '電話認証がされているアカウントのみ',
  },
};

export default new CronBuilder({ minute: 0 }, () => {
  const now = dayjs().tz('Asia/Tokyo').get('hour');
  start(now);
  end(now);
});

async function start(hour: number) {
  const settings = await AutomationSetting.find({
    'memberVerify.enable': true,
    'memberVerify.time.start': hour,
  });

  for (const setting of settings) {
    const guild = await client.guilds.fetch(setting.serverId).catch(() => null);
    const level = setting.memberVerify.level.after;
    if (!guild || level == null) return;

    setting.memberVerify.level.before = guild.verificationLevel;
    await setting.save({ wtimeout: 1_500 });
    guild
      .setVerificationLevel(level)
      .then(() => sendLog(guild, setting.memberVerify, level, '開始'))
      .catch(console.error);
  }
}

async function end(hour: number) {
  const settings = await AutomationSetting.find({
    'memberVerify.enable': true,
    'memberVerify.time.end': hour,
  });

  for (const setting of settings) {
    const guild = await client.guilds.fetch(setting.serverId).catch(() => null);
    const level = setting.memberVerify.level.before;
    if (!guild || level == null) return;

    guild
      .setVerificationLevel(level)
      .then(() => sendLog(guild, setting.memberVerify, level, '終了'))
      .catch(console.error);
  }
}

async function sendLog(
  guild: Guild,
  setting: AutomationSettingSchema['memberVerify'],
  level: GuildVerificationLevel,
  label: string,
) {
  if (!setting.log.enable || !setting.log.channel) return;

  const channel = await guild.channels
    .fetch(setting.log.channel)
    .catch(() => null);
  if (!channel?.isTextBased()) return;

  channel
    .send({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('✅')} 認証レベル自動変更 - ${label}`)
          .setDescription(
            [
              `サーバーの認証レベルを**${levels[level].name}**に変更しました`,
              inlineCode(levels[level].description),
            ].join('\n'),
          )
          .setColor(Colors.Green),
      ],
    })
    .catch(console.error);
}
