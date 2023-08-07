import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, EmbedBuilder, GuildFeature, PermissionFlagsBits } from 'discord.js';

export default new ChatInput({
  name: 'pauseinvite',
  description: 'サーバー招待の一時停止状態を切り替えます',
  options: [
    { name: 'pause', description: '一時停止状態にするか', type: ApplicationCommandOptionType.Boolean, required: true },
  ],
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
}, interaction => {
  const pause = interaction.options.getBoolean('pause', true);
  if (!interaction.guild) return interaction.reply({ content: 'サーバー内でのみ使用できます', ephemeral: true });
  const guildFeatures = interaction.guild.features;
  if (guildFeatures.includes(GuildFeature.InvitesDisabled) === pause)
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('❌ 既にその状態に設定されています')
          .setColor('Red'),
      ], ephemeral: true,
    });

  if (pause)
    interaction.guild.edit({ features: [...guildFeatures, GuildFeature.InvitesDisabled], reason: `招待一時停止 by ${interaction.user.tag}` }).then(() => {
      const embed = new EmbedBuilder()
        .setDescription('✅ サーバー招待を**一時停止**しました！')
        .setColor('Green');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });

  else
    interaction.guild.edit({ features: guildFeatures.filter(v => v !== GuildFeature.InvitesDisabled), reason: `招待一時停止解除 by ${interaction.user.tag}` }).then(() => {
      const embed = new EmbedBuilder()
        .setDescription('✅ サーバー招待の一時停止を**解除**しました！')
        .setColor('Green');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    });

});