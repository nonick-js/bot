const { AuditLogEvent, EmbedBuilder, inlineCode, Colors, codeBlock, formatEmoji, Events } = require('discord.js');
const ConfigSchema = require('../schemas/configSchema');
const { isBlocked } = require('../utils/functions');

const banAddLog = {
  name: Events.GuildBanAdd,
  once: false,
  /** @param {import('discord.js').GuildBan} ban */
  async execute(ban) {
    if (isBlocked(ban.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: ban.guild.id });
    if (!GuildConfig?.log?.enable || !GuildConfig?.log?.category?.ban) return;

    const auditLogs = await ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanAdd,
      limit: 3,
    }).catch(() => {});

    const log = auditLogs?.entries?.find(v => v?.target?.id == ban.user.id);
    if (!log) return;

    /** @param {import('discord.js').TextChannel} */
    const channel = await ban.guild.channels.fetch(GuildConfig.log.channel).catch(() => {});
    if (!channel) {
      await GuildConfig.updateOne({
        $set: {
          'log.enable': false,
          'log.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 2000 });
    }

    const embed = new EmbedBuilder()
      .setTitle('`🔨` BAN')
      .setDescription([
        `**${ban.user.tag}**`,
        `${formatEmoji('1005688192818761748')}ユーザーID: ${inlineCode(ban.user.id)}`,
      ].join('\n'))
      .setThumbnail(ban.user.displayAvatarURL())
      .setColor(Colors.Red)
      .setFields({ name: '理由', value: codeBlock(log.reason ?? '入力されていません') })
      .setFooter({ text: log.executor.tag, iconURL: log.executor.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};

const banRemoveLog = {
  name: Events.GuildBanRemove,
  once: false,
  /** @param {import('discord.js').GuildBan} ban */
  async execute(ban) {
    if (isBlocked(ban.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: ban.guild.id });
    if (!GuildConfig?.log?.enable || !GuildConfig?.log?.category?.ban) return;

    const auditLogs = await ban.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberBanRemove,
      limit: 3,
    }).catch(() => {});

    const log = auditLogs?.entries?.find(v => v?.target?.id == ban.user.id);
    if (!log) return;

    /** @param {import('discord.js').TextChannel} */
    const channel = await ban.guild.channels.fetch(GuildConfig.log.channel).catch(() => {});
    if (!channel) {
      await GuildConfig.updateOne({
        $set: {
          'log.enable': false,
          'log.channel': null,
        },
      });
      return GuildConfig.save({ wtimeout: 1500 });
    }

    const embed = new EmbedBuilder()
      .setTitle('`🔨` BAN解除')
      .setDescription([
        `**${ban.user.tag}**`,
        `${formatEmoji('1005688192818761748')}ユーザーID: ${inlineCode(ban.user.id)}`,
      ].join('\n'))
      .setThumbnail(ban.user.displayAvatarURL())
      .setColor(Colors.Red)
      .setFooter({ text: log.executor.tag, iconURL: log.executor.displayAvatarURL() })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};

module.exports = [ banAddLog, banRemoveLog ];