const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-welcome',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

		const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.welcome.enable = !Config.welcome.enable;
		await Config.save({ wtimeout: 1500 });

    embed.fields[0].value = settingSwitcher('STATUS_CH', Config.welcome.enable, Config.welcome.channel) + `\n\n> ${welcomeM_preview(Config.welcome.message).split('\n').join('\n> ')}`;

    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', Config.welcome.enable))
      .setStyle(settingSwitcher('BUTTON_STYLE', Config.welcome.enable)),

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction ];