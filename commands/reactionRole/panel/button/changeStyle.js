const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole_button-changeStyle',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const button = interaction.message.components[0];
    const style = button.components[3].style + 1;

    button.components[3] = discord.ButtonBuilder.from(button.components[3]).setStyle(style > 4 ? 1 : style);
    interaction.update({ embeds: [interaction.message.embeds[0]], components: [button] });
  },
};

module.exports = [ buttonInteraction ];