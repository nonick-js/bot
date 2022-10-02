const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-image',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const embed = interaction.message.embeds[0];

		const modal = new discord.ModalBuilder()
			.setCustomId('embed-imageModal')
			.setTitle('画像')
			.addComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('thumbnail')
						.setLabel('サムネイルに設定するURL')
						.setMaxLength(1000)
						.setValue(embed.thumbnail?.url || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('image')
						.setLabel('埋め込み内画像に設定するURL')
						.setMaxLength(1000)
						.setValue(embed.image?.url || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
			);

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'embed-imageModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const thumbnail = interaction.fields.getTextInputValue('thumbnail');
		const image = interaction.fields.getTextInputValue('image');

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
			.setThumbnail(urlCheck(thumbnail))
			.setImage(urlCheck(image));

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

		function urlCheck(param) {
			if (!param) return null;
			else if (param.startsWith('https://') || param.startsWith('http://')) return param;
			else return interaction.message.embeds[0]?.[Object.keys({ param })[0]];
		}
	},
};

module.exports = [ buttonInteraction, modalInteraction ];