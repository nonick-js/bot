const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-log',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
		const button = interaction.message.components[1];

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.log.enable = !Config.log.enable;
		await Config.save({ wtimeout: 3000 });

    embed.fields[0].value = settingSwitcher('STATUS_CH', Config.log.enable, Config.log.channel);
    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', Config.log.enable))
      .setStyle(settingSwitcher('BUTTON_STYLE', Config.log.enable)),

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction ];