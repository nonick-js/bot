const { EmbedBuilder, Colors } = require('discord.js');
const { admin } = require('../../config.json');

/** @param {import('discord.js').BaseInteraction} interaction */
const CheckPermission = (interaction) => {
  const embed = new EmbedBuilder()
    .setDescription('`❌` あなたにはこのコマンドを実行する権限がありません。')
    .setColor(Colors.Red);

  if (!admin.users.includes(interaction.user.id)) return embed;
  return null;
};

module.exports = CheckPermission;