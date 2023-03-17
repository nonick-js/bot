import { AuditLogEvent, Colors, EmbedBuilder, Events, formatEmoji, User } from 'discord.js';
import { GrayEmojies, BlurpleEmojies } from '../../module/emojies';
import { DiscordEventBuilder } from '../../module/events';
import { isBlocked } from '../../module/functions';
import { getServerSetting } from '../../module/mongo/middleware';

const kickLog = new DiscordEventBuilder({
  type: Events.GuildAuditLogEntryCreate,
  execute: async (auditLog, guild) => {
    if (isBlocked(guild)) return;
    if (auditLog.action !== AuditLogEvent.MemberKick || !(auditLog.target instanceof User)) return;

    const setting = await getServerSetting(guild.id, 'log');
    if (!setting?.kick.enable || !setting.kick.channel) return;

    const channel = await guild.channels.fetch(setting.kick.channel).catch(() => null);
    const executor = await auditLog.executor?.fetch();

    if (channel?.isTextBased())
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle('`🔨` Kick')
            .setDescription([
              `${formatEmoji(GrayEmojies.member)} **対象者:** ${auditLog.target} [\`${auditLog.target.tag}\`]`,
              '',
              `${formatEmoji(BlurpleEmojies.member)} **実行者:** ${executor} [\`${executor?.tag}\`]`,
              `${formatEmoji(BlurpleEmojies.text)} **理由:** ${auditLog.reason ?? '理由が入力されていません'}`,
            ].join('\n'))
            .setColor(Colors.Orange)
            .setThumbnail(auditLog.target.displayAvatarURL())
            .setTimestamp(),
        ],
      }).catch(() => { });
  },
});

module.exports = [kickLog];