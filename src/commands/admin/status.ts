import { ChatInput } from '@akki256/discord-interaction';
import { admin } from '@config';
import {
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  inlineCode,
  version,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'status',
    ...createDescription('commands.status.description'),
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: admin.guild },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!admin.users.includes(interaction.user.id))
      return interaction.reply({
        content: langs.tl('field.notPermitted', 'label.notCommandPermission'),
        ephemeral: true,
      });
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${interaction.client.user.username} のステータス`)
          .setDescription(
            [
              `${inlineCode('🌐')} **Ping**: ${inlineCode(
                `${interaction.client.ws.ping}`,
              )}`,
              `${inlineCode('💾')} **メモリ使用量**: ${inlineCode(
                (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
              )}MB`,
              `${inlineCode('💽')} **Discord.js**: ${inlineCode(version)}`,
              `${inlineCode('💻')} **プラットフォーム**: ${inlineCode(
                process.platform,
              )}`,
              `${inlineCode('📡')} **導入数**: ${inlineCode(
                `${interaction.client.guilds.cache.size}`,
              )} サーバー`,
              `${inlineCode('👥')} **総メンバー数**: ${inlineCode(
                `${interaction.client.guilds.cache.reduce(
                  (a, b) => a + b.memberCount,
                  0,
                )}`,
              )} 人`,
            ].join('\n'),
          )
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setColor(Colors.Blurple),
      ],
      ephemeral: true,
    });
  },
);
