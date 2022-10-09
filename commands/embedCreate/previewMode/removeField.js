const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-removeField',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const modal = new discord.ModalBuilder()
			.setCustomId('embed-removeFieldModal')
			.setTitle('フィールドを削除')
			.setComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('削除するフィールドの名前')
						.setMaxLength(256)
						.setStyle(discord.TextInputStyle.Short),
				),
			);

		interaction.showModal(modal);
	},
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'embed-removeFieldModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const name = interaction.fields.getTextInputValue('name');
		const fields = interaction.message.embeds[0].fields.filter(v => v.name !== name);

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0]).setFields(fields);

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));
	},
};

module.exports = [ buttonInteraction, modalInteraction ];