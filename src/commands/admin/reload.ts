import { ChatInput } from '@akki256/discord-interaction';
import { admin } from '@config';
import { Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'reload',
    ...createDescription('commands.reload.description'),
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
  },
  { guildId: admin.guild },
  async (interaction) => {
    langs.setLang(interaction.locale);
    if (!admin.users.includes(interaction.user.id))
      return interaction.reply({
        content: langs.tl('field.notPermitted', 'label.notCommandPermission'),
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
