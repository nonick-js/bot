const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { admin } = require('../../config.json');
const CheckPermission = require('./_permissionCheck');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'reload',
    description: '🔧 BOTを再起動します',
    guildId: admin.guild,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    if (CheckPermission(interaction)) return interaction.reply({ embeds: [CheckPermission(interaction)], ephemeral: true });

    // このコードはPM2環境下でしか作動しません
    // プロセスを強制終了させ、PM2の自動再起動を利用し再起動します

    const embed = new EmbedBuilder()
      .setDescription('`🔌` 再起動します...')
      .setColor('Green');

    interaction.reply({ embeds: [embed], ephemeral: true })
      .then(() => process.exit(1));
  },
};
module.exports = [ commandInteraction ];