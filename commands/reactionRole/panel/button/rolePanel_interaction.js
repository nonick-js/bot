// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const FeatureData = require('../../../../schemas/featureDataSchema');

module.exports = {
  /** @param {discord.ButtonInteraction} interaction */
  async execute(interaction) {
    if (interaction.type == discord.InteractionType.MessageComponent && isNaN(interaction.customId)) return;

    const GuildFeatureData = await FeatureData.findOne({ serverId: interaction.guildId });
    const messages = GuildFeatureData.reactionRole.button.messages.find(v => v.channelId == interaction.channelId && v.messageId == interaction.message.id);

    if (!messages) return;

    const errorEmbed = new discord.EmbedBuilder()
      .setDescription(`${discord.formatEmoji('1014606484849565797')} ロールの付与/解除できませんでした。\nサーバーの管理者に連絡してください。`)
      .setColor('Red');

    const errorEmbed_admin = new discord.EmbedBuilder()
      .setDescription([
        `${discord.formatEmoji('1014606484849565797')} ロールの付与/解除ができませんでした。`,
        `・${interaction.client.user.username}に\`ロール管理\`権限が付与されているか。`,
        `・パネルにある役職よりも上に**${interaction.client.user.username}**が持つ役職があるか。`,
        '・ロールが存在しているか',
      ].join('\n'))
      .setColor('Red');

    if (interaction.member.roles.cache.has(interaction.customId)) {
      interaction.member.roles.remove(interaction.customId)
        .then(() => {
          const successEmbed = new discord.EmbedBuilder()
            .setDescription(`✅ ${discord.roleMention(interaction.customId)}の付与を解除しました！`)
            .setColor('Green');
          interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch(() => interaction.reply({ embeds: [interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild) ? errorEmbed_admin : errorEmbed], ephemeral: true }));
    }
    else {
      interaction.member.roles.add(interaction.customId)
        .then(() => {
          const successEmbed = new discord.EmbedBuilder()
            .setDescription(`✅ ${discord.roleMention(interaction.customId)}を付与しました！`)
            .setColor('Green');
          interaction.reply({ embeds: [successEmbed], ephemeral: true });
        })
        .catch(() => interaction.reply({ embeds: [interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild) ? errorEmbed_admin : errorEmbed], ephemeral: true }));
    }
  },
};