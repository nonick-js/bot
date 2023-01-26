import { Colors, EmbedBuilder, inlineCode, PermissionFlagsBits, version } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { checkPermission } from '../../../module/functions';
import Config from '../../../../config.json';

const statusCommand = new ChatInput(
  {
    name: 'status',
    description: '👷 BOTのステータスを表示',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: Config.admin.guild },
  async (interaction): Promise<void> => {
    await checkPermission(interaction);
    if (interaction.replied) return;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${interaction.client.user.username} のステータス`)
          .setDescription([
            `\`🌐\` **Ping**: ${inlineCode(`${interaction.client.ws.ping}`)}`,
            `\`💾\` **メモリ使用量**: ${inlineCode((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))}MB`,
            `\`💽\` **Discord.js**: ${inlineCode(version)}`,
            `\`💻\` **プラットフォーム**: ${inlineCode(process.platform)}`,
            `\`📡\` **導入数**: ${inlineCode(`${interaction.client.guilds.cache.size}`)} サーバー`,
            `\`👥\` **総メンバー数**: ${inlineCode(`${interaction.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`)} 人`,
          ].join('\n'))
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setColor(Colors.Blurple),
      ],
      ephemeral: true,
    });
  },
);

module.exports = [statusCommand];