const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'messageReport',
    type: 'MODAL',
  },
	exec: async (interaction) => {
		const Config = await Configs.findOne({ serverId: interaction.guildId });
		const report = Config.report;

		const customId = interaction.components[0].components[0].customId;
		const value = interaction.components[0].components[0].value;
		const message = await interaction.channel.messages.fetch(customId).catch(() => {});

		if (!message) {
			const embed = new discord.EmbedBuilder()
				.setDescription('❌ 通報しようとしているメッセージは削除されました。')
				.setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		const embed = new discord.EmbedBuilder()
			.setTitle('⚠️ 通報 (メッセージ)')
			.setDescription(`\`\`\`${value}\`\`\``)
			.setColor('Red')
			.setFields(
				{ name: '投稿者', value: `${message.author}`, inline:true },
				{ name: '投稿先', value: `${message.channel} [リンク](${message.url})`, inline:true },
				{ name: 'メッセージ', value: message.content || '__なし__' },
			)
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		if (message.attachments.first()) embed.setImage(message.attachments.first().url);

		const channel = await interaction.guild.channels.fetch(report.channel).catch(() => {});
		const content = report.mention ? `<@&${report.mentionRole}>` : ' ';

		if (!channel) {
			report.enable = false;
			report.channel = null;
			Config.save({ wtimeout: 1500 });

			const errorEmbed = new discord.EmbedBuilder()
				.setAuthor({ name: '通報の送信中に問題が発生しました。', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
				.setColor('Red');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}

		channel.send({ content: content, embeds: [embed] })
			.then(() => {
				const successEmbed = new discord.EmbedBuilder()
					.setDescription('✅ **報告ありがとうございます！** 通報をサーバー運営に送信しました！')
					.setColor('Green');
				interaction.reply({ embeds: [successEmbed], ephemeral: true });
			})
			.catch(() => {
				const errorEmbed = new discord.EmbedBuilder()
					.setAuthor({ name: '通報の送信中に問題が発生しました。', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setColor('Red');
				interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			});
	},
};

module.exports = [ modalInteraction ];