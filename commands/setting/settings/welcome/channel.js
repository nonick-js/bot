const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { textChannelCheck } = require('../../../../modules/valueCheck');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-welcomeCh',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new discord.ModalBuilder()
      .setCustomId('setting-welcomeCh-modal')
      .setTitle('入室メッセージ')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('チャンネルの名前')
						.setMaxLength(100)
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(true),
				),
			);

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'setting-welcomeCh-modal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const name = interaction.fields.getTextInputValue('name');

    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];
    const channel = interaction.guild.channels.cache.find(v => v.name === name);

    await textChannelCheck(channel, interaction);
    if (interaction.replied) return;

		const Config = await Configs.findOne({ serverId: interaction.guildId });
		Config.welcome.channel = channel.id;
		await Config.save({ wtimeout: 1500 });

		embed.fields[0].value = settingSwitcher('STATUS_CH', Config.welcome.enable, Config.welcome.channel) + `\n\n> ${welcomeM_preview(Config.welcome.message).split('\n').join('\n> ')}`;
    button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(false);
    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];