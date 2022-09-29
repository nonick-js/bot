const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-leaveMessage',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
		const Config = await Configs.findOne({ serverId: interaction.guildId });

		const modal = new discord.ModalBuilder()
			.setCustomId('setting-leaveMessage-modal')
			.setTitle('退室ログメッセージ')
			.addComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('message')
						.setLabel('退室ログに表示するメッセージ')
						.setPlaceholder('各テキストのマークアップは公式ドキュメントを参照してください')
						.setMaxLength(3000)
						.setValue(Config.leave.message)
						.setStyle(discord.TextInputStyle.Paragraph)
						.setRequired(true),
				),
			);

		interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'setting-leaveMessage-modal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const message = interaction.fields.getTextInputValue('message');

		const embed = interaction.message.embeds[0];

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.leave.message = message;
		await Config.save({ wtimeout: 3000 });

		embed.fields[1].value = settingSwitcher('STATUS_CH', Config.leave.enable, Config.leave.channel) + `\n\n> ${welcomeM_preview(Config.leave.message).split('\n').join('\n> ')}`;

		interaction.update({ embeds: [embed] });
	},
};

module.exports = [ buttonInteraction, modalInteraction ];