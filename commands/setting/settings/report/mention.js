const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-reportRoleMention',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.report.mention = !Config.report.mention;
		await Config.save({ wtimeout: 3000 });

    embed.fields[1].value = settingSwitcher('STATUS_ROLE', Config.report.mention, Config.report.mentionRole);
    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setLabel(settingSwitcher('BUTTON_LABEL', Config.report.mention))
      .setStyle(settingSwitcher('BUTTON_STYLE', Config.report.mention));

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction ];