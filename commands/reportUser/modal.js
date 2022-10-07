const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
		customId: 'userReport',
    type: 'MODAL',
  },
	exec: async (interaction) => {
		const Config = await Configs.findOne({ serverId: interaction.guildId });
		const report = Config.report;

		const customId = interaction.components[0].components[0].customId;
		const value = interaction.components[0].components[0].value;
		const user = await interaction.client.users.fetch(customId).catch(() => {});

		const embed = new discord.EmbedBuilder()
			.setTitle('⚠️ 通報 (メンバー)')
			.setDescription(`\`\`\`${value}\`\`\``)
			.setColor('Red')
			.setFields({ name: '対象者', value: `${user}`, inline:true })
			.setThumbnail(user.displayAvatarURL())
			.setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

		const content = report.mention ? `<@&${report.mentionRole}>` : ' ';
		const channel = await interaction.guild.channels.fetch(report.channel).catch(() => {});

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