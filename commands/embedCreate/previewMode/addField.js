const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-addField',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const modal = new discord.ModalBuilder()
			.setCustomId('embed-addFieldModal')
			.setTitle('フィールドを追加')
			.setComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('フィールドの名前')
						.setMaxLength(256)
						.setStyle(discord.TextInputStyle.Short),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('value')
						.setLabel('フィールドの値')
						.setMaxLength(1024)
						.setStyle(discord.TextInputStyle.Paragraph),
				),
			);

		interaction.showModal(modal);
	},
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'embed-addFieldModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const name = interaction.fields.getTextInputValue('name');
		const value = interaction.fields.getTextInputValue('value');

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0]).addFields({ name: name, value: value });

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));
	},
};

module.exports = [ buttonInteraction, modalInteraction ];