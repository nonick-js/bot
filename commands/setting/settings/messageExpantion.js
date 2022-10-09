const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/settingStatusSwitcher');
const Configs = require('../../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const commandInteraction = {
  data: {
    customId: 'setting-messageExpansion',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.messageExpansion = !Config.messageExpansion;
		await Config.save({ wtimeout: 1500 });

    embed.fields[0].value = settingSwitcher('STATUS_ENABLE', Config.messageExpansion);
    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', Config.messageExpansion))
      .setStyle(settingSwitcher('BUTTON_STYLE', Config.messageExpansion));

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};
module.exports = [ commandInteraction ];