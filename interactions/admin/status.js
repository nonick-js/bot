const { PermissionFlagsBits, EmbedBuilder, version } = require('discord.js');
const { admin } = require('../../config.json');
const CheckPermission = require('./_permissionCheck');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
  data: {
    name: 'status',
    description: '[🔧] BOTのステータスを表示',
    guildId: admin.guild,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    if (CheckPermission(interaction)) return interaction.reply({ embeds: [CheckPermission(interaction)], ephemeral: true });

    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.client.user.username} のステータス`)
      .setDescription([
        `**🌐 Ping:** \`${interaction.client.ws.ping}\``,
        `**💾 メモリ使用量:** \`${ram}\`MB`,
        `**💽 Discord.js:** \`v${version}\``,
        `**💻 プラットフォーム:** \`${process.platform}\``,
        `**📡 導入数:** \`${interaction.client.guilds.cache.size}\`サーバー`,
        `**👥 総メンバー数:** \`${interaction.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}\` 人`,
      ].join('\n'))
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setColor('Green');

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

module.exports = [ ping_command ];