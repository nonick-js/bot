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

		const res = await Configs.findOneAndUpdate(
			{ serverId: interaction.guildId },
			{ $set: { 'leave.message': message }, $setOnInsert: { serverId: interaction.guildId } },
			{ upsert: true, new: true },
		);
		res.save({ wtimeout: 1500 });

		embed.fields[1].value = settingSwitcher('STATUS_CH', res.leave.enable, res.leave.channel) + `\n\n> ${welcomeM_preview(res.leave.message).split('\n').join('\n> ')}`;

		interaction.update({ embeds: [embed] });
	},
};

module.exports = [ buttonInteraction, modalInteraction ];