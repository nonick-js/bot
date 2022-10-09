const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
	data: {
		customId: 'embed-sendEmbed',
		type: 'BUTTON',
	},
	exec: async (interaction) => {
		const modal = new discord.ModalBuilder()
			.setCustomId('embed-sendEmbedModal')
			.setTitle('送信')
			.setComponents(
				new discord.ActionRowBuilder().setComponents(
					new discord.TextInputBuilder()
						.setCustomId('name')
						.setLabel('名前 (省略可能)')
						.setMaxLength(80)
						.setStyle(discord.TextInputStyle.Short)
						.setRequired(false),
				),
				new discord.ActionRowBuilder().setComponents(
					new discord.TextInputBuilder()
						.setCustomId('iconURL')
						.setLabel('アイコンのURL (省略可能)')
						.setMaxLength(500)
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
		customId: 'embed-sendEmbedModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const name = interaction.fields.getTextInputValue('name');
		const iconURL = interaction.fields.getTextInputValue('iconURL');

		if (name || iconURL) {
			await interaction.deferUpdate();

			const webhooks = await interaction.guild.fetchWebhooks().catch(() => {});

			try {
				if (!interaction.guild.members.me.permissions.has(discord.PermissionFlagsBits.ManageWebhooks)) {
					throw [
						`*${interaction.client.user.username} の権限が不足しています！`,
						'**必要な権限**: `ウェブフックの管理`',
					];
				}
				if (iconURL && !(iconURL?.startsWith('http://') || iconURL?.startsWith('https://'))) throw ['アイコンのURLが無効です！', null];
				if (!webhooks) throw ['何らかの原因でWebhookが正しく作成されませんでした...', '時間をおいて再度お試しください。'];
			} catch (err) {
				const error = new discord.EmbedBuilder()
					.setAuthor({ name: err[0], iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription(err[1])
					.setColor('Red');
				return interaction.editReply({ embeds: [interaction.message.embeds[0], error] });
			}

			/** @type {discord.Webhook} */
			const myWebhook = webhooks?.find(webhook => webhook.owner.id == interaction.client.user.id) || await interaction.channel.createWebhook({ name: name || 'NoNICK.js' }).catch(() => {});
			await myWebhook.edit({ name: name || 'NoNICK.js', avatar: iconURL, channel: interaction.channel.id });
			myWebhook.send({ embeds: [interaction.message.embeds[0]] })
				.then(() => {
					const successEmbed = new discord.EmbedBuilder()
						.setDescription('✅ 埋め込みを送信しました！')
						.setColor('Green');
					interaction.editReply({ content: '', embeds: [successEmbed], components: [] });
				})
				.catch((err) => {
					const errorEmbed = new discord.EmbedBuilder()
						.setAuthor({ name: 'エラー！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
						.setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
						.setColor('Red');
					interaction.editReply({ embeds: [interaction.message.embeds[0], errorEmbed] });
				});
		} else {
			if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) {
				const error = new discord.EmbedBuilder()
					.setAuthor({ name: `#${interaction.channel} での ${interaction.client.user.username} の権限が不足しています！`, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription('**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`')
					.setColor('Red');
				return interaction.update({ embeds: [interaction.message.embeds[0], error] });
			}

			interaction.channel.send({ embeds: [interaction.message.embeds[0]] })
				.then(() => {
					const successEmbed = new discord.EmbedBuilder()
						.setDescription('✅ 埋め込みを送信しました!')
						.setColor('Green');
					interaction.update({ content: ' ', embeds: [successEmbed], components:[] });
				})
				.catch((err) => {
					const errorEmbed = new discord.EmbedBuilder()
						.setAuthor({ name: 'エラー！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
						.setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
						.setColor('Red');
					interaction.update({ embeds: [interaction.message.embeds[0], errorEmbed] });
				});
		}
	},
};

module.exports = [ buttonInteraction, modalInteraction ];