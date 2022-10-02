const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-author',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const embed = interaction.message.embeds[0];

		const modal = new discord.ModalBuilder()
			.setCustomId('embed-authorModal')
			.setTitle('投稿者')
			.addComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('名前')
						.setMaxLength(256)
						.setValue(embed.author?.name || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('iconURL')
						.setLabel('アイコンのURL')
						.setMaxLength(1000)
						.setValue(embed.author?.iconURL || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('url')
						.setLabel('ハイパーリンク')
						.setMaxLength(1000)
						.setValue(embed.author?.url || '')
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
		customId: 'embed-authorModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const name = interaction.fields.getTextInputValue('name');
		const iconURL = interaction.fields.getTextInputValue('iconURL');
		const url = interaction.fields.getTextInputValue('url');

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
			.setAuthor({
				name: name || null,
				iconURL: urlCheck(iconURL),
				url: urlCheck(url),
			});

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

		function urlCheck(param) {
			if (!param) return null;
			else if (param.startsWith('https://') || param.startsWith('http://')) return param;
			else return interaction.message.embeds[0]?.author?.[Object.keys({ param })[0]];
		}
	},
};

module.exports = [ buttonInteraction, modalInteraction ];