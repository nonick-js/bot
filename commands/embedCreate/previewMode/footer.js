const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-footer',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const embed = interaction.message.embeds[0];

		const modal = new discord.ModalBuilder()
			.setCustomId('embed-footerModal')
			.setTitle('フッター')
			.setComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('text')
						.setLabel('テキスト')
						.setMaxLength(2048)
						.setValue(embed.footer?.text || '')
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
			),
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('iconURL')
						.setLabel('アイコンのURL')
						.setMaxLength(1000)
						.setValue(embed.footer?.iconURL || '')
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
		customId: 'embed-footerModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const text = interaction.fields.getTextInputValue('text');
		const iconURL = interaction.fields.getTextInputValue('iconURL');

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
			.setFooter({
				text: text || null,
				iconURL: urlCheck(iconURL),
			});

		interaction.update({ embeds: [embed] }).catch(() => interaction.update({}));

		function urlCheck(param) {
			if (!param) return null;
			else if (param.startsWith('https://') || param.startsWith('http://')) return param;
			else return interaction.message.embeds[0]?.footer?.[Object.keys({ param })[0]];
		}
	},
};

module.exports = [ buttonInteraction, modalInteraction ];