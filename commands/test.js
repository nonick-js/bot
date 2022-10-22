const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'test',
    description: 'テストコマンド',
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const select = new discord.ActionRowBuilder().addComponents(
      new discord.SelectMenuBuilder({ type: 5 })
      .setCustomId('test')
      .setMaxValues(25),
    );

    const select1 = new discord.ActionRowBuilder().addComponents(
      new discord.SelectMenuBuilder({ type: 6 })
        .setCustomId('test1')
        .setMaxValues(25),
    );

    const select2 = new discord.ActionRowBuilder().addComponents(
      new discord.SelectMenuBuilder({ type: 6 })
        .setCustomId('test2')
        .setMaxValues(25),
    );

    interaction.reply({ content: '`🔨`BANするメンバーを選択してください。\n**重要: この操作は元に戻せません！慎重に操作してください。**', components: [select, select1, select2], ephemeral: true });
  },
};
module.exports = [ commandInteraction ];