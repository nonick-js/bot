const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-export',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const modal = new discord.ModalBuilder()
			.setCustomId('embed-exportModal')
			.setTitle('エクスポート')
			.setComponents(
				new discord.ActionRowBuilder().addComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('ファイルの名前 (日本語は使用できません)')
						.setMaxLength(100)
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
		customId: 'embed-exportModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }).replace(/[^0-9]/g, '');
		const embedData = interaction.message.embeds[0].toJSON();

		const file = new discord.AttachmentBuilder()
			.setName((interaction.fields.getTextInputValue('name') || `embed_${interaction.guildId}-${date}`) + '.json')
			.setFile(Buffer.from(JSON.stringify(embedData, null, 2)));

		interaction.followUp({ content: '✅ 現在の埋め込みの状態をエクスポートしました。`/embed import`で読み込ませることができます。', files: [file] })
			.catch((err) => {
				const embed = new discord.EmbedBuilder()
					.setAuthor({ name: 'ファイル生成時にエラーが発生しました。再度お試し下さい。', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription(`\`\`\`${err}\`\`\``)
					.setColor('Red');
				interaction.followUp({ embeds: [embed], ephemeral: true });
			});
	},
};

module.exports = [ buttonInteraction, modalInteraction ];