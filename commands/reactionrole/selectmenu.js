// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
  data: {
    customId: 'reactionRole',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    if (interaction.message.flags.has(discord.MessageFlags.Ephemeral)) return interaction.update({});
    await interaction.deferReply({ ephemeral: true });

    const roles = interaction.member?.roles;
    let error = false;

    if (roles instanceof discord.GuildMemberRoleManager) {
      await roles.remove(interaction.component.options.map(opt => opt.value).filter(opt => !interaction.values.includes(opt))).catch(() => error = true);
      await roles.add(interaction.values).catch(() => error = true);

      try {
        if (error && interaction.member.permissions.has(discord.PermissionFlagsBits.ManageRoles)) { throw [
          '一部ロールが付与/解除できませんでした。以下を確認してください。',
          `・${interaction.client.user.username}に\`ロール管理\`権限が付与されているか。\n・パネルにある役職よりも上に**${interaction.client.user.username}**が持つ役職があるか。\n・ロールが存在しているか。`,
        ];}
        if (error) throw ['一部ロールが付与/解除できませんでした。サーバーの管理者にお問い合わせください。', null];
      } catch (err) {
        const embed = new discord.EmbedBuilder()
					.setAuthor({ name: err[0], iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription(err[1])
					.setColor('Red');
        return interaction.followUp({ embeds: [embed], ephemeral: true });
      }

      const embed = new discord.EmbedBuilder()
        .setDescription('✅ ロールを更新しました!')
        .setColor('Green');
      return interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      const errorEmbed = new discord.EmbedBuilder()
				.setAuthor({ name: 'このチャンネルでは使用できません', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};

module.exports = [ ping_command ];