const { EmbedBuilder, Colors } = require('discord.js');
const { admin } = require('../../../config.json');

const embed = new EmbedBuilder()
  .setDescription('`❌` あなたにはこのコマンドを実行する権限がありません')
  .setColor(Colors.Red);

/** @param {import('discord.js').BaseInteraction} interaction */
const CheckPermission = (interaction) => {
  if (!admin.users.includes(interaction.user.id)) return embed;
  return undefined;
};

module.exports = CheckPermission;