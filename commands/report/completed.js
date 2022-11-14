const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'report-completed',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];

    const newEmbed = discord.EmbedBuilder.from(embed)
      .setTitle('✅ 対処済み')
      .setColor('Green')
      .setFooter({ text: `by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    interaction.update({ embeds: [newEmbed], components: [] });
  },
};
module.exports = [ buttonInteraction ];