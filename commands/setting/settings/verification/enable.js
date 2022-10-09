const discord = require('discord.js');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');
const Configs = require('../../../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-verification',
     type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

		const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.verification.enable = !Config.verification.enable;
		await Config.save({ wtimeout: 1500 });

    embed.fields[0].value = settingSwitcher('STATUS_ENABLE', Config.verification.enable);
    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', Config.verification.enable))
      .setStyle(settingSwitcher('BUTTON_STYLE', Config.verification.enable));

		interaction.update({ embeds: [interaction.message.embeds[0]], components: [interaction.message.components[0], button] });
  },
};
module.exports = [ buttonInteraction ];