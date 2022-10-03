const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const selectMenuInteraction = {
  data: {
    customId: 'setting-logEvents',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[2];

    const values = interaction.values;
    const categoryData = [
      { key: 'bot', value: `${interaction.client.user.username}` },
      { key: 'timeout', value: 'タイムアウト' },
      { key: 'kick', value: 'Kick' },
      { key: 'ban', value: 'BAN' },
    ];
    const category = categoryData.map(v => ({ key: v.key, value: v.value, enable: values.includes(v.key) }));

    await Configs.findOneAndUpdate(
      { serverId: interaction.guildId },
      { $set: { log: { category: Object.assign({}, ...category.map(v => ({ [v.key]: v.enable }))) } } },
      { new: true },
    );

    embed.fields[1].value = category.filter(v => v.enable).map(v => `\`${v.value}\``).join(' ') || 'なし';
    button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(embed.fields[1].value == 'なし');

		interaction.update({ embeds: [embed], components: [interaction.message.components[0], interaction.message.components[1], interaction.message.components[2]] });
  },
};

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-logEvents-removeAll',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[2];

    const events = interaction.message.components[1].components[0].options;

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.log.category = Object.assign({}, ...events.map(v => ({ [v.value]: false })));
		await Config.save({ wtimeout: 1500 });

    embed.fields[1].value = 'なし';
    button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(true);

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], interaction.message.components[1], button] });
  },
};

module.exports = [ selectMenuInteraction, buttonInteraction ];