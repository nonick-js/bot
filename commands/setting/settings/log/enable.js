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

    const res = await Configs.findOneAndUpdate(
      { serverId: interaction.guildId },
      { $setOnInsert: { serverId: interaction.guildId } },
      { upsert: true, new: true },
    );
    res.log.enable = !res.log.enable;
    res.save({ wtimeout: 1500 });

    embed.fields[0].value = settingSwitcher('STATUS_CH', res.log.enable, res.log.channel);
    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', res.log.enable))
      .setStyle(settingSwitcher('BUTTON_STYLE', res.log.enable)),

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction ];