const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
			customId: 'embed-sendEmbed',
			type: 'BUTTON',
	},
	exec: async (interaction) => {
		if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) {
			const error = new discord.EmbedBuilder()
				.setAuthor({ name: `#${interaction.channel} での ${interaction.client.user.username} の権限が不足しています！`, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
				.setDescription('**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`')
				.setColor('Red');
			return interaction.update({ embeds: [interaction.message.embeds[0], error] });
		}

		interaction.channel.send({ embeds: [interaction.message.embeds[0]] })
			.then(() => {
				const success = new discord.EmbedBuilder()
					.setDescription('✅ 埋め込みを送信しました!')
					.setColor('Green');
				interaction.update({ content: ' ', embeds: [success], components:[] });
			})
			.catch((err) => {
				const error = new discord.EmbedBuilder()
					.setAuthor({ name: 'エラー！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
					.setColor('Red');
				interaction.update({ embeds: [interaction.message.embeds[0], error] });
			});
	},
};

module.exports = [ buttonInteraction ];