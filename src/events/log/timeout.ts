import { AuditLogEvent, Colors, EmbedBuilder, Events, formatEmoji, GuildMember, time, User } from 'discord.js';
import { BlurpleEmojies, GrayEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';

const timeoutLog = new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  async execute(auditLog, guild) {
    if (isBlocked(guild)) return;
    if (auditLog.action !== AuditLogEvent.MemberUpdate || !(auditLog.target instanceof User)) return;

    const timeoutChange = auditLog.changes.find(v => v.key === 'communication_disabled_until');
    const setting = await getServerSetting(guild.id, 'log');
    if (!setting?.timeout.enable || !setting.timeout.channel || !timeoutChange) return;

    const channel = await guild.channels.fetch(setting.timeout.channel).catch(() => null);
    const member = await guild.members.fetch(auditLog.target.id).catch(() => null);
    const executor = await auditLog.executor?.fetch();

    if (!channel?.isTextBased() || !(member instanceof GuildMember)) return;

    if (Date.parse(timeoutChange.new as string) > Date.now())
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              `${formatEmoji(GrayEmojies.schedule)} **解除される時間:** ${time(Math.floor((member.communicationDisabledUntilTimestamp ?? 0) / 1000), 'f')}`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Red)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });

    else
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🛑` タイムアウト手動解除')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Blue)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });
  },
});

module.exports = [timeoutLog];