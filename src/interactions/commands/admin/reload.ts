import { ChatInput } from '@akki256/discord-interaction';
import { admin } from '@config';
import { permissionField } from '@modules/fields';
import { Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default new ChatInput(
  {
    name: 'reload',
    description: 'BOTを再起動する',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: admin.guild },
  async (interaction) => {
    if (!admin.users.includes(interaction.user.id))
      return interaction.reply({
        content: permissionField(['コマンドの実行権限がありません']),
        ephemeral: true,
      });
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🔌` 再起動します...')
          .setColor(Colors.Green),
      ],
      ephemeral: true,
    });

    process.exit();
  },
);
