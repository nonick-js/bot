const discord = require('discord.js');
const { urlCheck } = require('../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
			customId: 'embed-basic',
			type: 'BUTTON',
	},
	exec: async (interaction) => {
		const embed = interaction.message.embeds[0];

		const modal = new discord.ModalBuilder()
			.setCustomId('embed-basicModal')
			.setTitle('タイトル・説明・色')
			.addComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('title')
						.setLabel('タイトル')
						.setMaxLength(1000)
						.setValue(embed.title)
						.setStyle(discord.TextInputStyle.Short),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('url')
						.setLabel('タイトルURL')
						.setMaxLength(1000)
						.setValue(embed.url || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('description')
						.setLabel('説明')
						.setMaxLength(4000)
						.setValue(embed.description || '')
						.setStyle(discord.TextInputStyle.Paragraph)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('color')
						.setLabel('カラーコード')
						.setMaxLength(7)
						.setPlaceholder('#ffffff')
						.setValue(embed.hexColor || '')
						.setStyle(discord.TextInputStyle.Short),
				),
			);

		interaction.showModal(modal);
	},
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'embed-basicModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const title = interaction.fields.getTextInputValue('title');
		const url = interaction.fields.getTextInputValue('url');
		const description = interaction.fields.getTextInputValue('description');
		const color = interaction.fields.getTextInputValue('color')?.match(new RegExp(/^#[0-9A-Fa-f]{6}$/, 'g'));

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
			.setTitle(title)
			.setURL(urlCheck(url, interaction))
			.setDescription(description || null)
			.setColor(color?.[0] || interaction.message.embeds[0].hexColor);

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));
	},
};

module.exports = [ buttonInteraction, modalInteraction ];