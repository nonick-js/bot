const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
  data: {
    customId: 'reactionRole-changeMode',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const select = interaction.message.components[0];
    const button = interaction.message.components[1];

    if (select.components[0].type == discord.ComponentType.Button) {
      const error = new discord.EmbedBuilder()
				.setAuthor({ name: '先にロールを追加してください！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.update({ embeds: [interaction.message.embeds[0], error] });
    }

    if (button.components[3].label == '単一選択') button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('複数選択');
    else button.components[3] = discord.ButtonBuilder.from(button.components[3]).setLabel('単一選択');
    interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
  },
};
module.exports = [ ping_command ];