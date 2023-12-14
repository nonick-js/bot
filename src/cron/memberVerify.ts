import { AutomationSetting, AutomationSettingSchema } from '@models';
import { CronBuilder } from '@modules/cron';
import { guildVerifyLevel } from 'database/models/util';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Colors, EmbedBuilder, Guild, inlineCode } from 'discord.js';
import { client } from 'index';
import { langs } from 'lang';
import { LangTemplate } from 'lang/template';
dayjs.extend(timezone);
dayjs.extend(utc);

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
      .then(() => sendLog(guild, setting.memberVerify, level, 'label.start'))
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
      .then(() => sendLog(guild, setting.memberVerify, level, 'label.end'))
      .catch(console.error);
  }
}

async function sendLog(
  guild: Guild,
  setting: AutomationSettingSchema['memberVerify'],
  level: (typeof guildVerifyLevel)[number],
  label: keyof LangTemplate,
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
          .setTitle(langs.tl('automation.memberVerify.title', label))
          .setDescription(
            [
              langs.tl('label.changeVerify', `label.verifyLevel.${level}.name`),
              inlineCode(langs.tl(`label.verifyLevel.${level}.description`)),
            ].join('\n'),
          )
          .setColor(Colors.Green),
      ],
    })
    .catch(console.error);
}
